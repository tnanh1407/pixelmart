import { Helmet } from "react-helmet-async";

export default function DefaultHelmet() {
  return <Helmet>
    <title>Nông Phẩm An Việt</title>
    <meta name="description" content="Cửa hàng nông sản sạch , an toàn từ bưu điện"></meta>
    <meta property="og:title" content="Nông sản Bưu điện" />
    <meta property="og:description" content="Cửa hàng nông sản sạch, an toàn từ bưu điện" />
    <meta property="og:image" content="/core/logo_web.svg" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  </Helmet>
}