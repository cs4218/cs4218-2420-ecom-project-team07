import slugify from "slugify";



export function toLowerSlug(string) {
	return slugify(string, { lower: true });
}
