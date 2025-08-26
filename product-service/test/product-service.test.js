const { expect } = require("chai");
const mongoose = require("mongoose");

const productController = require("../controllers/product");

describe("Product Service Testing", function () {
	before(async function () {
		await mongoose.connect(
			process.env.MONGODB_URI || "mongodb://localhost:27017/testdb"
		);
		console.log("Connected tp product DB");
	});
	after(async function () {
		await mongoose.connection.close();
	});

	it("should create and return a new product for the client", async function () {
		let req = {
			body: {
				name: "Test Product",
				price: 30,
				discription: "test",
				category: "electronic",
				stock: 500,
			},
			get: function (header) {
				return "53912309123";
			},
		};
	});

	let res = {
		statusCode: 0,
		jsonData: null,
		status: function (code) {
			this.statusCode = code;
			return this;
		},
		json: function (data) {
			this.jsonData = data;
			return this;
		},
	};

	expect(res.statusCode).to.equal(201);
	expect(res.jsonData).to.have.property("product");
});
