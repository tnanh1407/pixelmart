import React from "react";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Tailwind,
  Text,
} from "@react-email/components";

interface ForgotPasswordEmailProps {
  name: string;
  resetUrl: string;
  expiresInMinutes: number;
}

export default function ForgotPasswordEmail({
  name,
  resetUrl,
  expiresInMinutes,
}: ForgotPasswordEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Đặt lại mật khẩu PixelMart</Preview>
      <Tailwind>
        <Body className="bg-gray-100 font-sans m-0 p-0">
          <Container className="mx-auto max-w-150 p-5">
            <Heading className="mb-5 text-2xl text-gray-800">
              Đặt lại mật khẩu
            </Heading>
            <Text className="mb-3 text-base leading-6 text-gray-800">
              Xin chào {name},
            </Text>
            <Text className="mb-3 text-base leading-6 text-gray-800">
              Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.
              Vui lòng nhấn vào nút bên dưới để đặt lại mật khẩu:
            </Text>
            <Container className="my-5 text-center">
              <Button
                href={resetUrl}
                className="inline-block rounded-lg bg-blue-600 px-6 py-3 text-base font-bold text-white no-underline"
              >
                Đặt lại mật khẩu
              </Button>
            </Container>
            <Text className="mb-2 text-sm leading-5 text-gray-500">
              Liên kết này sẽ hết hạn sau {expiresInMinutes} phút.
            </Text>
            <Text className="mb-2 text-sm leading-5 text-gray-500">
              Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
