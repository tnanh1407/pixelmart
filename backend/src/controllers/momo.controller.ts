import { Request, Response, NextFunction } from "express";
import momoService from "../services/momo.service.js";
import { MOMO_CONFIG } from "../config/momo.js";
import { AppError } from "../middlewares/error.middleware.js";

class MomoController {
  async createPayment(req: Request, res: Response) {
    const { amount, orderId, orderInfo, extraData } = req.body;

    if (!amount || !orderId) {
      throw new AppError("Thiếu amount hoặc orderId", 400);
    }

    const result = await momoService.createPayment({
      amount: Number(amount),
      orderId,
      orderInfo: orderInfo || `Thanh toán đơn hàng #${orderId}`,
      extraData: extraData || "",
    });

    res.json({ success: true, data: result });
  }

  mockPayPage(req: Request, res: Response) {
    const { requestId, orderId, amount } = req.query;

    const html = `<!DOCTYPE html>
<html lang="vi">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>MoMo Mock Payment</title>
<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f5f5f5;display:flex;justify-content:center;align-items:center;min-height:100vh}.container{background:white;border-radius:16px;box-shadow:0 4px 24px rgba(0,0,0,.1);width:100%;max-width:400px;padding:32px 24px}.header{text-align:center;margin-bottom:24px}.logo{font-size:24px;font-weight:700;color:#AE2070;margin-bottom:4px}.logo span{color:#D82D8B}.subtitle{color:#666;font-size:14px}.amount-card{background:linear-gradient(135deg,#AE2070,#D82D8B);color:white;border-radius:12px;padding:20px;text-align:center;margin-bottom:24px}.amount-label{font-size:12px;opacity:.8;margin-bottom:8px}.amount-value{font-size:32px;font-weight:700}.info{margin-bottom:24px}.info-row{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #eee;font-size:14px}.info-row:last-child{border-bottom:none}.info-label{color:#666}.info-value{color:#333;font-weight:500}.buttons{display:flex;gap:12px}.btn{flex:1;padding:14px;border-radius:12px;border:none;font-size:16px;font-weight:600;cursor:pointer;transition:opacity .2s}.btn:hover{opacity:.9}.btn-success{background:#AE2070;color:white}.btn-danger{background:#f5f5f5;color:#666}.status-message{text-align:center;margin-top:16px;font-size:14px;display:none}.status-message.show{display:block}.success{color:#28a745}.error{color:#dc3545}</style></head>
<body><div class="container">
<div class="header"><div class="logo">Mo<span>Mo</span></div><div class="subtitle">Mock Payment Gateway</div></div>
<div class="amount-card"><div class="amount-label">SỐ TIỀN THANH TOÁN</div><div class="amount-value">${Number(amount).toLocaleString("vi-VN")}đ</div></div>
<div class="info">
<div class="info-row"><span class="info-label">Mã đơn hàng</span><span class="info-value">${orderId}</span></div>
<div class="info-row"><span class="info-label">Mã giao dịch</span><span class="info-value">${requestId}</span></div>
<div class="info-row"><span class="info-label">Phí giao dịch</span><span class="info-value">Miễn phí</span></div>
</div>
<div class="buttons"><button class="btn btn-danger" onclick="handleCancel()">Hủy</button><button class="btn btn-success" onclick="handlePay()">Thanh toán</button></div>
<div id="status" class="status-message"></div></div>
<script>
async function handlePay(){const s=document.getElementById('status');s.className='status-message show success';s.textContent='Đang xử lý...';
try{const r=await fetch('/api/v1/payment/momo/ipn',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({partnerCode:'${MOMO_CONFIG.PARTNER_CODE}',orderId:'${orderId}',requestId:'${requestId}',amount:${amount},orderInfo:'OK',orderType:'momo_wallet',transId:Date.now(),resultCode:0,message:'Success (Mock)',payType:'qr',responseTime:Date.now(),extraData:'',signature:'mock'})});
if(r.ok){s.textContent='Thành công! Đang chuyển hướng...';setTimeout(()=>{window.location.href='${MOMO_CONFIG.REDIRECT_URL}?partnerCode=${MOMO_CONFIG.PARTNER_CODE}&orderId=${orderId}&requestId=${requestId}&amount=${amount}&orderInfo=OK&orderType=momo_wallet&transId='+Date.now()+'&resultCode=0&message=Successful.&payType=qr&responseTime='+Date.now()+'&extraData=&signature=mock'},1500)}}catch(e){s.className='status-message show error';s.textContent='Lỗi: '+e.message}}
async function handleCancel(){const s=document.getElementById('status');
try{await fetch('/api/v1/payment/momo/ipn',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({partnerCode:'${MOMO_CONFIG.PARTNER_CODE}',orderId:'${orderId}',requestId:'${requestId}',amount:${amount},orderInfo:'OK',orderType:'momo_wallet',transId:Date.now(),resultCode:1001,message:'User cancelled',payType:'qr',responseTime:Date.now(),extraData:'',signature:'mock'})});
s.className='status-message show error';s.textContent='Đã hủy thanh toán';
setTimeout(()=>{window.location.href='${MOMO_CONFIG.REDIRECT_URL}?resultCode=1001&message=User+cancelled'},1000)}catch(e){s.className='status-message show error';s.textContent='Lỗi: '+e.message}}
</script></body></html>`;

    res.send(html);
  }

  async ipnCallback(req: Request, res: Response) {
    await momoService.processIPN(req.body);
    res.status(200).json({ message: "OK" });
  }

  async checkStatus(req: Request, res: Response) {
    const { orderId, requestId } = req.query;
    const result = await momoService.checkPaymentStatus(orderId as string, requestId as string);
    res.json({ success: true, data: result });
  }
}

export default new MomoController();
