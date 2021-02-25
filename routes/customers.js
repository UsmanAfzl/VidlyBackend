const express = require("express");
const Router = express.Router();
const mongoose = require("mongoose");
const Joi = require("joi");

const customerSchema = new mongoose.Schema({
  isGold: Boolean,
  name: String,
  phone: String,
});

const Customer = mongoose.model("Customer", customerSchema);

Router.get("/", async (req, res) => {
  const customers = await Customer.find().sort({ name: 1 });
  res.send(customers);
});

Router.get("/:id", async (req, res) => {
  const customer = await Customer.find(req.params.id);
  if (!customer)
    return res.status(404).send("Customer with given ID was not found");
  res.send(customer);
});

Router.post("/", async (req, res) => {
  console.log(req.body);
  const { error } = validateCustomer(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const customer = new Customer({
    name: req.body.name,
    phone: req.body.phone,
    isGold: req.body.isGold,
  });
  const result = await customer.save();
  res.send(result);
});

Router.put("/:id", async (req, res) => {
  const { error } = validateCustomer(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findById(req.params.id);
  if (!customer)
    return res.status(404).send("The customer with given ID was not found");

  customer.name = req.body.name;
  customer.phone = req.body.phone;
  customer.isGold = req.body.isGold;
  const result = await customer.save();
  res.send(result);
});

Router.delete("/:id", async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer)
    return res.status(404).send("Customer with given ID was not found");
  const result = await customer.delete();
  res.send(result);
});

function validateCustomer(customer) {
  const schema = {
    name: Joi.string().required(),
    isGold: Joi.boolean().required(),
    phone: Joi.string().required(),
  };
  return Joi.validate(customer, schema);
}

module.exports = Router;
