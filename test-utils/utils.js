import mongoose from "mongoose";
import products from "../test-utils/test.products.json";



function getImportedPhoto(exportedPhoto) {
	return {
		data: Buffer.from(exportedPhoto.data.$binary.base64, 'base64'),
		contentType: exportedPhoto.contentType
	};
}

export function getSampleProducts() {
	return products.map((product) => {
		return {
			name: product.name,
			description: product.description,
			price: product.price,
			category: new mongoose.Types.ObjectId(product.category.$oid),
			quantity: product.quantity,
			shipping: product.shipping,
			photo: getImportedPhoto(product.photo),

			_id: new mongoose.Types.ObjectId(product._id.$oid),
			slug: product.slug
		};
	});
}
