import { Text as RNText, StyleSheet, TextProps } from "react-native";

const SYNE_WEIGHT_MAP: Record<string, string> = {
  "400": "Syne_400Regular",
  normal: "Syne_400Regular",
  "500": "Syne_500Medium",
  "600": "Syne_600SemiBold",
  "700": "Syne_700Bold",
  bold: "Syne_700Bold",
  "800": "Syne_800ExtraBold",
};

/** All app text — uses Syne, auto-maps fontWeight to correct variant. */
export function Text({ style, className, ...props }: TextProps & { className?: string }) {
  const flat = StyleSheet.flatten(style) || {};
  const weight = String(flat.fontWeight ?? "400");
  let fontFamily = SYNE_WEIGHT_MAP[weight] ?? "Syne_400Regular";

  // NativeWind className parsing: check for weight keywords in className
  if (className) {
    if (className.includes("font-extrabold")) fontFamily = "Syne_800ExtraBold";
    else if (className.includes("font-bold")) fontFamily = "Syne_700Bold";
    else if (className.includes("font-semibold")) fontFamily = "Syne_600SemiBold";
    else if (className.includes("font-medium")) fontFamily = "Syne_500Medium";
  }

  const { fontWeight, ...styleWithoutWeight } = flat;

  return <RNText {...props} className={className} style={[styleWithoutWeight, { fontFamily }]} />;
}

/** Numbers/amounts only — uses Space Grotesk Bold. */
export function AmountText({ style, ...props }: TextProps) {
  return (
    <RNText
      {...props}
      style={[{ fontFamily: "SpaceGrotesk_700Bold" }, style]}
    />
  );
}
