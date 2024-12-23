"use client";

import React, { useState } from "react";
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

export default function QRForm() {
  const { theme } = useTheme();
  const [input, setInput] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [loading, setLoading] = useState(false);
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

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!input) {
      toast.error("Please enter some text or a URL.");
      setLoading(false);
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
      console.log("button clicked");
      toast.success("Qreate generated successfully.");
    } catch (error) {
      toast.error("Qreate generation failed.");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleErrorCorrectionChange = (value: "L" | "M" | "Q" | "H") => {
    setErrorCorrection(value);
    setSelectedErrorCorrection(
      errorCorrectionOptions.find((option) => option.value === value) ||
        errorCorrectionOptions[3]
    );
  };

  return (
    <form onSubmit={handleGenerate}>
      <div className="flex flex-row gap-5 w-full max-w-[900px] mt-10 mx-auto p-6 bg-white dark:bg-zinc-950 rounded-lg shadow-md">
        <div className="space-y-4 w-[600px]">
          <div className="text-center">
            <h1 className="text-2xl font-bold">QR Code Generator</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Enter text or a URL to generate a QR code.
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

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Generating..." : "Generate QR Code"}
          </Button>
        </div>
        <div className="flex justify-center w-full">
          {qrCode ? (
            <img
              src={qrCode}
              alt="QR Code"
              className="border border-zinc-200 dark:border-zinc-800 rounded-lg"
            />
          ) : (
            <img
              src={
                theme === "dark" ? "placeholder-dark.png" : "placeholder.png"
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
