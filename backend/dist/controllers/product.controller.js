import productService from "../services/product.service.js";
class ProductController {
    async getProducts(req, res) {
        const result = await productService.getProducts(req.query);
        res.json({
            success: true,
            ...result
        });
    }
    async getProductById(req, res) {
        const product = await productService.getProductById(req.params.id);
        res.json({
            success: true,
            data: product
        });
    }
    async createProduct(req, res) {
        const userId = req.user.userId;
        const userRole = req.user.role;
        const product = await productService.createProduct(userId, userRole, req.body);
        res.status(201).json({
            success: true,
            data: product
        });
    }
    async updateProduct(req, res) {
        const userId = req.user.userId;
        const userRole = req.user.role;
        const product = await productService.updateProduct(userId, userRole, req.params.id, req.body);
        res.json({
            success: true,
            data: product
        });
    }
    async deleteProduct(req, res) {
        const userId = req.user.userId;
        const userRole = req.user.role;
        const result = await productService.deleteProduct(userId, userRole, req.params.id);
        res.json({
            success: true,
            ...result
        });
    }
}
export default new ProductController();
