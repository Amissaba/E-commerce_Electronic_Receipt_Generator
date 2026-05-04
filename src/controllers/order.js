const { v4: uuidv4 } = require('uuid');
const { Product, Order, sequelize } = require('../../models');
const {generateReceiptPDF} = require('../services/generateReceipt') 
const {sendEmail} = require('../services/email_service')
const cloudinary = require('../../config/cloudinary')

const createOrder = async (req, res) => {
  const t = await sequelize.transaction();
  let committed = false;
   const { items } = req.body;
  try {
   
    const customer_id = req.customer.customer_id;

    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new Error('Cart is empty');
    }

    for (const item of items) {
      if (!item.product_id) {
        throw new Error('Product ID is required for each item');
      }

      if (!item.quantity || item.quantity <= 0) {
        throw new Error(`Invalid quantity for product ${item.product_id}`);
      }
    }

    const productIds = items.map(item => item.product_id);

    const products = await Product.findAll({
      where: { product_id: productIds },
      transaction: t
    });

    if (products.length === 0) {
      throw new Error('No products found in the cart');
    }

    const foundProductIds = products.map(product => product.product_id);

    const missingProductIds = productIds.filter(
      id => !foundProductIds.includes(id)
    );

    if (missingProductIds.length > 0) {
      await t.rollback();
      return res.status(404).json({
        message: 'Some products were not found',
        missingProducts: missingProductIds
      });
    }

    const product_data = [];
    let total_amount = 0;

    for (const item of items) {
      const product = products.find(
        product => product.product_id === item.product_id
      );

      const quantity = item.quantity;

      if (quantity > product.stock) {
        await t.rollback();
        return res.status(400).json({
          message: `Insufficient stock for product ${product.product_name}`,
          availableStock: product.stock
        });
      }

      const unit_price = Number(product.unit_price);
      const discount_percentage = Number(product.discount_percentage || 0);

      const discounted_amount = (unit_price * discount_percentage) / 100;
      const priceAfterDiscount = unit_price - discounted_amount;
      const subtotal = priceAfterDiscount * quantity;

      total_amount += subtotal;

      product_data.push({
        product_id: product.product_id,
        product_name: product.product_name,
        unit: product.unit,
        unit_price,
        discount_percentage,
        quantity,
        subtotal: Number(subtotal.toFixed(2))
      });

      product.stock = product.stock - quantity;
      await product.save({ transaction: t });
    }
    const finalTotal = Number(total_amount.toFixed(2));

    const order = await Order.create(
      {
        order_id: uuidv4(),
        customer_id,
        product_data,
        totalamount: finalTotal,
        order_status: 'PENDING'
      },
      { transaction: t }
    );

    await t.commit();
    committed = true;
    try{
       const receiptPath = await generateReceiptPDF({
        ...order.toJSON(),
        totalamount: finalTotal
    });


    const uploadResult = await cloudinary.uploader.upload(receiptPath, {
        resource_type: "raw",
        folder: "receipts",
        access_mode: "public"
    });
    // console.log("Cloudinary URL:", uploadResult.secure_url);

    await order.update({
        receipt_url: uploadResult.secure_url
    });

    await sendEmail(
        req.customer.email,
        "Your Order Receipt",
        {
            customer_name: req.customer.username || req.customer.full_name || "Customer",
            order_id: order.order_id,
            totalamount: finalTotal,
            receipt_url: uploadResult.secure_url,
            items: product_data
        },
        "receipt"
    );
    } catch (receiptError) {
        console.error("Error generating receipt or sending email:", receiptError.message);
    }
    return res.status(201).json({
      message: 'Order created successfully',
      data: order
    });

  } catch (error) {
    if(!committed){
        await t.rollback();
    }

    return res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  createOrder
};