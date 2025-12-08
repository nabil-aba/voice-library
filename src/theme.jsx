import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
  fonts: {
    heading: "'Orbitron', sans-serif",
    body: "'Inter', sans-serif",
  },
  styles: {
    global: {
      body: {
        bg: "body-bg",
        color: "text-primary",
        scrollBehavior: "smooth",
      },
    },
  },
  colors: {
    brand: {
      500: "#238636",
      600: "#1a6328",
    },
    surface: {
      100: "#161B22",
      200: "#21262D",
      300: "#30363D",
    },
    like: {
      500: "#f78166",
    },
    "body-bg": "#0D1117",
    "text-primary": "#C9D1D9",
  },
  components: {
    Button: {
      baseStyle: {
        _focus: { boxShadow: "none" },
      },
    },
    IconButton: {
      baseStyle: {
        _focus: { boxShadow: "none" },
      },
    },
  },
});

export default theme;
