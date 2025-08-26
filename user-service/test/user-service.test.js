const { expect } = require("chai");
const mongoose = require("mongoose");

const userController = require("../controllers/user");

describe("user-service", () => {
    before(async function () {
        this.timeout(30000);

        const mongoUri =
            process.env.MONGODB_URI || "mongodb://localhost:27017/testdb";

        try {
            await mongoose.connect(mongoUri);
            console.log("Connected to test database");
        } catch (error) {
            console.error("Database connection error:", error);
            throw error;
        }
    });

    after(async function () {
        await mongoose.connection.close();
    });

    it("should create a user successfully", async function () {
        this.timeout(10000);
        const req = {
            body: {
                name: "Test User",
                email: "test@example.com",
                password: "password123",
            },
        };

        const res = {
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

        const next = () => {};

        try {
            await userController.createUser(req, res, next);

            expect(res.statusCode).to.equal(201);
            expect(res.jsonData).to.have.property(
                "message",
                "user created successfully"
            );
            expect(res.jsonData).to.have.property("user");
        } catch (error) {
            console.error("Test failed with error:", error);
            throw error;
        }
    });

    it("should return 200 status code and the token after logging the user", async function () {
        this.timeout(10000);
        const req = {
            body: {
                email: "test@example.com",
                password: "password123",
            },
        };
        const res = {
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
        const next = () => {};
        await userController.login(req, res, next);
        expect(res.statusCode).to.equal(200);
        expect(res.jsonData).to.have.property("token");
    });

    it("should return unauthorized and 401 code after varifying the incorrect token of another user", async function () {
        this.timeout(10000);
        const req = {
            headers: { authorization: "bearer jdsbjdbsabdbjasd" },
        };
        const res = {
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
        const next = () => {};
        await userController.isAuth(req, res, next);
        expect(res.statusCode).to.equal(401);
        expect(res.jsonData).to.have.property("message", "Not Authorized");
    });

    it("should return Authorized and 200 code after varifying the correct token of another user", async function () {
        this.timeout(10000);
        let req = {
            body: {
                email: "test@example.com",
                password: "password123",
            },
        };
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
        const next = () => {};
        await userController.login(req, res, next);
        req = {
            headers: { authorization: `bearer ${res.jsonData.token}` },
        };
        res = {
            headers: {},
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
            set: function (h, val) {
                this.headers[h] = val;
            },
        };
        await userController.isAuth(req, res, next);
        expect(res.statusCode).to.equal(200);
        expect(res.jsonData).to.have.property("message", "Authorized");
        expect(res.headers).to.have.property(
            "X-User-Email",
            "test@example.com"
        );
    });
});
