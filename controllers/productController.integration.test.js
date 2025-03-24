import { expect, jest } from "@jest/globals";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import productModel from "../models/productModel.js";
import { mockRequest, mockResponse } from "../test-utils/mocks.js";
import { getSampleProducts } from "../test-utils/utils.js";
import { getProductController, getSingleProductController, productCountController, productPhotoController } from "./productController.js";



const SAMPLE_PRODUCTS = getSampleProducts();
beforeAll(async () => {
	await connectDB();

	// Clear all products
	console.log("Deleting all products...");
	await productModel.deleteMany({});
	console.log("Deleted!");

	// Insert sample products
	console.log("Inserting sample products...");
	await productModel.insertMany(SAMPLE_PRODUCTS);
	console.log("Inserted!");
});

beforeEach(() => {
	jest.clearAllMocks();
});

afterAll(async () => {
	await mongoose.connection.close();
});

describe("product controller + product model + slugify integration tests", () => {
	// getProductController
	it("should successfully get all products", async () => {
		let req = mockRequest();
		let res = mockResponse();
		await getProductController(req, res);

		expect(res.status).toBeCalledWith(StatusCodes.OK);
		expect(res.send).toBeCalledWith({
			products: expect.any(Array)
		});
		expect(res.send.mock.calls[0][0].products).toHaveLength(SAMPLE_PRODUCTS.length);
	});

	// getSingleProductController
	it("should successfully get the specified product", async () => {
		let slug = SAMPLE_PRODUCTS[0].slug;
		let req = mockRequest(
			undefined,
			{ slug },
		);
		let res = mockResponse();
		await getSingleProductController(req, res);

		expect(res.status).toBeCalledWith(StatusCodes.OK);
		expect(res.send).toBeCalledWith({
			product: expect.objectContaining(
				{ slug }
			)
		});
	});

	it("should fail to find the non-existent product", async () => {
		let slug = "my-product-slug-no-such-product";
		let req = mockRequest(
			undefined,
			{ slug },
		);
		let res = mockResponse();
		await getSingleProductController(req, res);

		expect(res.status).toBeCalledWith(StatusCodes.NOT_FOUND);
	});

	// productPhotoController
	it("should successfully get the specified product's photo", async () => {
		let product = SAMPLE_PRODUCTS[1];
		let id = product._id.toString();
		let contentType = product.photo.contentType;
		let data = product.photo.data;

		let req = mockRequest(
			undefined,
			{ pid: id },
		);
		let res = mockResponse();
		await productPhotoController(req, res);

		expect(res.set).toBeCalledWith("Content-Type", contentType);
		expect(res.status).toBeCalledWith(StatusCodes.OK);
		expect(res.send).toHaveBeenCalledWith(expect.any(Buffer));
		// https://jestjs.io/docs/expect#:~:text=use%20equals%20method%20of%20Buffer%20class
		expect(res.send.mock.calls[0][0].equals(data)).toBe(true);
	});

	it("should reject malformed product object IDs", async () => {
		let id = "(Cast to ObjectId should fail for this value)";
		let req = mockRequest(
			undefined,
			{ pid: id },
		);
		let res = mockResponse();
		await productPhotoController(req, res);

		expect(res.status).toBeCalledWith(StatusCodes.BAD_REQUEST);
		expect(res.send).toHaveBeenCalledWith();
	});

	it("should fail to find the non-existent product's photo", async () => {
		let id = "111111111111111111111111";
		let req = mockRequest(
			undefined,
			{ pid: id },
		);
		let res = mockResponse();
		await productPhotoController(req, res);

		expect(res.status).toBeCalledWith(StatusCodes.NOT_FOUND);
		expect(res.send).toHaveBeenCalledWith();
	});

	// productCountController
	it("should successfully count all products", async () => {
		let req = mockRequest();
		let res = mockResponse();
		await productCountController(req, res);

		expect(res.status).toBeCalledWith(StatusCodes.OK);
		expect(res.send).toBeCalledWith(
			{ total: SAMPLE_PRODUCTS.length }
		);
	});
});
