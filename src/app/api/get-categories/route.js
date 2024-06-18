import categories from "../../../data/categories.json";
export async function GET(request) {
  return Response.json(categories);
}
