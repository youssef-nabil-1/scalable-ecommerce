const expect = require("chai").expect;
const sinon = require("sinon");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userController = require("../controllers/user");

describe("createUser", () => {
	it("should create a user successfully", async (done) => {
		const req = {
			body: {
				name: "Test User",
				email: "test@example.com",
				password: "password123",
			},
		};
		const res = {
			status: function (code) {
				this.statusCode = code;
				return this;
			},
			json: function () {
				return this;
			},
		};
		const next = () => {};
		await userController.createUser(req, res, next);

		expect(res.status).to.equal(201);
		done();
	});
});
