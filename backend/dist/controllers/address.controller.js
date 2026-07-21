import { Province, District, Ward } from "../models/address-division.model.js";
class AddressController {
    async getProvinces(req, res) {
        const list = await Province.find().sort({ name: 1 });
        res.json({
            success: true,
            data: list,
        });
    }
    async getDistricts(req, res) {
        const { provinceCode } = req.query;
        if (!provinceCode) {
            res.status(400).json({
                success: false,
                message: "provinceCode query parameter is required",
            });
            return;
        }
        const list = await District.find({ provinceCode: String(provinceCode) }).sort({ name: 1 });
        res.json({
            success: true,
            data: list,
        });
    }
    async getWards(req, res) {
        const { districtCode } = req.query;
        if (!districtCode) {
            res.status(400).json({
                success: false,
                message: "districtCode query parameter is required",
            });
            return;
        }
        const list = await Ward.find({ districtCode: String(districtCode) }).sort({ name: 1 });
        res.json({
            success: true,
            data: list,
        });
    }
}
export default new AddressController();
