"use client";

import React, { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import QRCode from "qrcode";
import { useTheme } from "next-themes";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

export default function QRForm() {
  const { theme } = useTheme();
  const [input, setInput] = useState("");
  const [qrCode, setQrCode] = useState("");
  // const [loading, setLoading] = useState(false);
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#FFFFFF");
  const errorCorrectionOptions = [
    { value: "L", label: "Low (L)" },
    { value: "M", label: "Medium (M)" },
    { value: "Q", label: "Quartile (Q)" },
    { value: "H", label: "High (H)" },
  ];

  const [errorCorrection, setErrorCorrection] = useState<"L" | "M" | "Q" | "H">(
    "H"
  );
  const [selectedErrorCorrection, setSelectedErrorCorrection] = useState(
    errorCorrectionOptions[3]
  );
  const [type, setType] = useState<"image/png" | "image/jpeg" | "image/webp">(
    "image/jpeg"
  );
  const [width, setWidth] = useState(240);
  const [quality, setQuality] = useState(0.3);
  const [margin, setMargin] = useState(1);

  const handleGenerate = useCallback(async () => {
    // setLoading(true);
    if (!input.trim()) {
      toast.error("Please enter some text or a URL.");
      return;
    }

    try {
      const options = {
        errorCorrectionLevel: errorCorrection,
        type: type,
        quality: quality,
        margin: margin,
        color: {
          dark: fgColor,
          light: bgColor,
        },
        width: width,
      };

      const qrCodeData = await QRCode.toDataURL(input, options);
      setQrCode(qrCodeData);
      // setLoading(false);
    } catch (error) {
      toast.error("QR code generation failed.");
      console.error("Error generating QR code:", error);
    }
  }, [input, errorCorrection, type, quality, margin, fgColor, bgColor, width]);

  useEffect(() => {
    if (input.trim()) {
      handleGenerate();
    }
  }, [handleGenerate, input]);

  const handleErrorCorrectionChange = (value: "L" | "M" | "Q" | "H") => {
    setErrorCorrection(value);
    setSelectedErrorCorrection(
      errorCorrectionOptions.find((option) => option.value === value) ||
        errorCorrectionOptions[3]
    );
  };

  const downloadQRCode = () => {
    if (qrCode) {
      const extension = type.split("/")[1]; // Extract the file extension from the type (e.g., "image/jpeg" -> "jpeg")
      const link = document.createElement("a");
      link.href = qrCode;
      link.download = `qrcode.${extension}`;
      link.click();
      toast.success("Downloaded Successfully");
    }
  };

  return (
    <form onSubmit={handleGenerate}>
      <div className="flex flex-row gap-5 w-full max-w-[900px] mt-10 mx-auto p-6 bg-white dark:bg-zinc-950 rounded-lg shadow-md">
        <div className="space-y-4 w-[600px]">
          <div className="text-center">
            <h1 className="text-2xl font-bold">QR Code Generator</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Developer -
              <Button variant="link">
                <Link href="https://github.com/celsopuerto" target="_blank">
                  celsopdev
                </Link>
              </Button>
            </p>
          </div>
          <div className="space-y-2">
            <label
              htmlFor="input"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Input
            </label>
            <Input
              id="input"
              name="input"
              type="text"
              placeholder="Enter text or URL"
              className="w-full"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />

            <div className="flex flex-row justify-between gap-4">
              <Select
                value={selectedErrorCorrection.value}
                onValueChange={handleErrorCorrectionChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Error Correction Level" />
                </SelectTrigger>
                <SelectContent>
                  {errorCorrectionOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={type}
                onValueChange={(value) =>
                  setType(value as "image/png" | "image/jpeg" | "image/webp")
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="image/png">PNG</SelectItem>
                  <SelectItem value="image/jpeg">JPEG</SelectItem>
                  <SelectItem value="image/webp">WEBP</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-row justify-evenly items-center gap-3">
              <label className="w-32">Quality</label>
              <Input
                type="number"
                min={0}
                max={1}
                step={0.1}
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
              />
            </div>

            <div className="flex flex-row justify-evenly items-center gap-3">
              <label className="w-32">Margin</label>
              <Input
                type="number"
                min={0}
                value={margin}
                onChange={(e) => setMargin(Number(e.target.value))}
              />
            </div>

            <div className="flex flex-row justify-evenly items-center gap-3">
              <label className="w-32">Size (px)</label>
              <Input
                type="number"
                min={0}
                step={20}
                value={width}
                onChange={(e) => setWidth(Number(e.target.value))}
              />
            </div>

            <div className="flex flex-row justify-between items-center">
              <label>Foreground Color (Dark)</label>
              <Input
                className="w-[50px]"
                type="color"
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
              />
            </div>
            <div className="flex flex-row justify-between items-center">
              <label>Background Color (White)</label>
              <Input
                className="w-[50px]"
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
              />
            </div>
          </div>
          {/* 
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Generating..." : "Generate QR Code"}
          </Button> */}
        </div>
        <div className="relative flex justify-center w-full">
          {qrCode ? (
            <>
              <img
                src={qrCode}
                alt="QR Code"
                className="border border-zinc-200 dark:border-zinc-800 rounded-lg"
              />
              <Button
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 border border-zinc-400 dark:border-zinc-700 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-950 dark:text-zinc-50 py-2 px-4 rounded-lg shadow-md"
                onClick={downloadQRCode}
              >
                Download QR Code
              </Button>
            </>
          ) : (
            <img
              src={
                theme === "light" ? "placeholder.png" : "placeholder-dark.png"
              }
              alt="QR Code"
              className="w-full h-auto object-contain"
            />
          )}
        </div>
      </div>
    </form>
  );
}
