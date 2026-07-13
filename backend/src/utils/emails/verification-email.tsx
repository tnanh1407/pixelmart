import React from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Tailwind,
  Text,
} from "@react-email/components";

interface VerificationEmailProps {
  name: string;
  code: string;
  expiresInMinutes: number;
}

export default function VerificationEmail({
  name,
  code,
  expiresInMinutes,
}: VerificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Xác thực tài khoản PixelMart</Preview>
      <Tailwind>
        <Body className="bg-gray-100 font-sans m-0 p-0">
          <Container className="mx-auto max-w-150 p-5">
            <Heading className="mb-5 text-2xl text-gray-800">
              Xác thực tài khoản
            </Heading>
            <Text className="mb-3 text-base leading-6 text-gray-800">
              Xin chào {name},
            </Text>
            <Text className="mb-3 text-base leading-6 text-gray-800">
              Mã xác thực tài khoản của bạn là:
            </Text>
            <Container className="my-5 rounded-lg bg-gray-200 p-5 text-center">
              <Text className="m-0 text-3xl font-bold tracking-[8px] text-gray-800">
                {code}
              </Text>
            </Container>
            <Text className="mb-2 text-sm leading-5 text-gray-500">
              Mã này sẽ hết hạn sau {expiresInMinutes} phút.
            </Text>
            <Text className="mb-2 text-sm leading-5 text-gray-500">
              Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
