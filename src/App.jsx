import { useState, useEffect, useMemo } from "react";
import {
  ChakraProvider,
  Box,
  Flex,
  Text,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  IconButton,
  Button,
  Badge,
  Container,
  Tooltip,
  useDisclosure,
  Tag,
  TagLabel,
  TagLeftIcon,
  VStack,
  Link,
  Divider,
  extendTheme,
  SimpleGrid,
  Icon,
} from "@chakra-ui/react";
import {
  FaSearch,
  FaMicrophoneAlt,
  FaLayerGroup,
  FaWaveSquare,
  FaInfoCircle,
  FaGithub,
  FaHeart,
  FaRegHeart,
  FaArrowDown,
  FaBriefcase,
  FaFilter,
  FaHashtag,
} from "react-icons/fa";

import { SCRIPT_LIBRARY } from "./data";
import { PrivacyPolicy, UsageEthics } from "./components/LegalSections";
import { HireMeModal, DownloadWarningModal } from "./components/BusinessModals";
import { ScriptCard } from "./components/AssetCard";

const theme = extendTheme({
  config: { initialColorMode: "dark", useSystemColorMode: false },
  styles: {
    global: {
      body: { bg: "#0D1117", color: "#C9D1D9", scrollBehavior: "smooth" },
    },
  },
  colors: {
    brand: { 500: "#238636", 600: "#1a6328" },
    surface: { 100: "#161B22", 200: "#21262D", 300: "#30363D" },
    like: { 500: "#f78166" },
  },
  components: {
    Button: { baseStyle: { _focus: { boxShadow: "none" } } },
    IconButton: { baseStyle: { _focus: { boxShadow: "none" } } },
  },
});

export default function App() {
  return (
    <ChakraProvider theme={theme}>
      <AssetManager />
    </ChakraProvider>
  );
}

function AssetManager() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [currentPlayingRef, setCurrentPlayingRef] = useState(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const ITEMS_PER_PAGE = 5;
  const [displayLimit, setDisplayLimit] = useState(ITEMS_PER_PAGE);

  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("nabilaba_favorites");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("nabilaba_favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const {
    isOpen: isDownloadOpen,
    onOpen: onDownloadOpen,
    onClose: onDownloadClose,
  } = useDisclosure();
  const {
    isOpen: isHireOpen,
    onOpen: onHireOpen,
    onClose: onHireClose,
  } = useDisclosure();
  const [selectedDownload, setSelectedDownload] = useState(null);

  const handleDownloadClick = (variant) => {
    setSelectedDownload(variant);
    onDownloadOpen();
  };

  const scrollToLegal = () => {
    const element = document.getElementById("legal-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const filteredScripts = useMemo(() => {
    setDisplayLimit(ITEMS_PER_PAGE);
    return SCRIPT_LIBRARY.filter((script) => {
      const matchesSearch =
        script.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        script.variations.some((v) =>
          v.speaker.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesFilter =
        activeFilter === "All" || script.tags.includes(activeFilter);
      const matchesFavorite =
        !showFavoritesOnly ||
        script.variations.some((v) => favorites.includes(v.id));

      return matchesSearch && matchesFilter && matchesFavorite;
    });
  }, [searchQuery, activeFilter, showFavoritesOnly, favorites]);

  const visibleScripts = filteredScripts.slice(0, displayLimit);
  const hasMore = displayLimit < filteredScripts.length;
  const allTags = [
    "All",
    ...new Set(SCRIPT_LIBRARY.flatMap((s) => s.tags)),
  ].slice(0, 10);

  return (
    <Box minH="100vh" bg="#0D1117" display="flex" flexDirection="column">
      {/* HEADER */}
      <Box
        borderBottom="1px solid"
        borderColor="surface.200"
        bg="#161B22"
        pt={4}
        pb={2}
        position="sticky"
        top={0}
        zIndex={100}
      >
        <Container maxW="container.xl">
          {/* Top Bar */}
          <Flex
            align="center"
            justify="space-between"
            mb={4}
            gap={4}
            wrap="nowrap"
          >
            {/* Logo */}
            <HStack spacing={3} flexShrink={0}>
              <Box
                p={2}
                bg="brand.500"
                borderRadius="lg"
                color="white"
                boxShadow="0 0 15px rgba(35, 134, 54, 0.4)"
              >
                <FaMicrophoneAlt size={18} />
              </Box>
              <Box>
                <Heading size="md" color="white" fontWeight="bold">
                  Nabil Aba
                </Heading>
                <HStack spacing={1}>
                  <Text
                    fontSize="xs"
                    color="gray.500"
                    fontWeight="mono"
                    letterSpacing="1px"
                  >
                    AUDIO LIBRARY
                  </Text>
                  <Badge colorScheme="blue" variant="solid" fontSize="8px">
                    BETA
                  </Badge>
                </HStack>
              </Box>
            </HStack>

            <InputGroup
              maxW="400px"
              size="sm"
              display={{ base: "none", md: "flex" }}
              flex={1}
            >
              <InputLeftElement
                pointerEvents="none"
                children={<FaSearch color="gray" />}
              />
              <Input
                placeholder="Search assets..."
                bg="#0D1117"
                border="1px solid"
                borderColor="surface.200"
                borderRadius="full"
                _focus={{ borderColor: "brand.500", ring: "none" }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </InputGroup>

            <HStack spacing={2} flexShrink={0}>
              <Button
                size="sm"
                leftIcon={<FaBriefcase />}
                colorScheme="gray"
                variant="solid"
                bg="surface.300"
                color="white"
                fontSize="xs"
                onClick={onHireOpen}
                _hover={{ bg: "surface.200" }}
                display={{ base: "none", md: "flex" }}
              >
                Work With Me
              </Button>

              <IconButton
                icon={<FaBriefcase />}
                variant="ghost"
                color="gray.400"
                onClick={onHireOpen}
                display={{ base: "flex", md: "none" }}
                size="sm"
                aria-label="Work"
              />

              <Tooltip label="Show Favorites" hasArrow bg="gray.700">
                <IconButton
                  icon={showFavoritesOnly ? <FaHeart /> : <FaRegHeart />}
                  variant={showFavoritesOnly ? "solid" : "ghost"}
                  colorScheme={showFavoritesOnly ? "pink" : "gray"}
                  color={showFavoritesOnly ? "white" : "gray.400"}
                  onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                  aria-label="Favorites"
                  size="sm"
                />
              </Tooltip>

              <Tooltip label="Legal & Info" hasArrow bg="gray.700">
                <IconButton
                  icon={<FaInfoCircle />}
                  variant="ghost"
                  color="gray.400"
                  onClick={scrollToLegal}
                  aria-label="Project Info"
                  size="sm"
                />
              </Tooltip>
            </HStack>
          </Flex>

          <Box display={{ base: "block", md: "none" }} mb={4}>
            <InputGroup size="sm">
              <InputLeftElement
                pointerEvents="none"
                children={<FaSearch color="gray" />}
              />
              <Input
                placeholder="Search assets..."
                bg="#0D1117"
                border="1px solid"
                borderColor="surface.200"
                borderRadius="full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </InputGroup>
          </Box>

          <HStack
            spacing={2}
            overflowX="auto"
            pb={2}
            css={{ "&::-webkit-scrollbar": { display: "none" } }}
          >
            <Text
              fontSize="xs"
              fontWeight="bold"
              color="gray.500"
              mr={2}
              display={{ base: "none", md: "block" }}
            >
              TAGS:
            </Text>
            {allTags.map((tag) => (
              <Tag
                key={tag}
                size="sm"
                variant={activeFilter === tag ? "solid" : "outline"}
                colorScheme={activeFilter === tag ? "green" : "gray"}
                cursor="pointer"
                borderRadius="full"
                px={3}
                onClick={() => setActiveFilter(tag)}
                flexShrink={0}
                transition="all 0.2s"
                _hover={{
                  bg: activeFilter === tag ? "brand.600" : "surface.300",
                }}
              >
                {tag === "All" ? (
                  <TagLeftIcon as={FaFilter} />
                ) : (
                  <TagLeftIcon as={FaHashtag} />
                )}
                <TagLabel>{tag}</TagLabel>
              </Tag>
            ))}
          </HStack>
        </Container>
      </Box>

      <Container maxW="container.xl" py={6} flex="1">
        <Flex
          mb={6}
          gap={{ base: 4, sm: 8 }}
          color="gray.500"
          fontSize="sm"
          borderBottom="1px solid"
          borderColor="surface.200"
          pb={4}
          wrap="wrap"
        >
          <HStack>
            <Icon as={FaLayerGroup} color="gray.400" />
            <Text fontWeight="bold" color="gray.300">
              {filteredScripts.length}
            </Text>
            <Text fontSize="xs">Scripts Available</Text>
          </HStack>
          <HStack>
            <Icon as={FaWaveSquare} color="gray.400" />
            <Text fontWeight="bold" color="gray.300">
              Neural
            </Text>
            <Text fontSize="xs">Voice Engine</Text>
          </HStack>
          {favorites.length > 0 && (
            <HStack color="like.500">
              <FaHeart />
              <Text fontWeight="bold">{favorites.length}</Text>
              <Text fontSize="xs">Saved</Text>
            </HStack>
          )}
        </Flex>

        <VStack spacing={4} align="stretch">
          {visibleScripts.map((script) => (
            <ScriptCard
              key={script.id}
              script={script}
              currentPlayingRef={currentPlayingRef}
              setCurrentPlayingRef={setCurrentPlayingRef}
              onDownload={handleDownloadClick}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              showFavoritesOnly={showFavoritesOnly}
              onHireOpen={onHireOpen}
            />
          ))}

          {hasMore && (
            <Button
              onClick={() => setDisplayLimit((prev) => prev + ITEMS_PER_PAGE)}
              variant="ghost"
              colorScheme="gray"
              size="sm"
              mt={4}
              rightIcon={<FaArrowDown />}
              w="full"
              border="1px dashed"
              borderColor="surface.300"
              _hover={{ bg: "surface.200", borderColor: "gray.500" }}
            >
              Load More Assets
            </Button>
          )}

          {filteredScripts.length === 0 && (
            <VStack py={20} spacing={4} opacity={0.6}>
              <FaSearch size={40} color="#30363D" />
              <Text color="gray.500">No assets found.</Text>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setActiveFilter("All");
                  setShowFavoritesOnly(false);
                }}
              >
                Clear Filters
              </Button>
            </VStack>
          )}
        </VStack>
      </Container>

      <Box
        id="legal-section"
        scrollMarginTop={{ base: "180px", md: "120px" }}
        bg="#0D1117"
        py={10}
        borderTop="1px solid"
        borderColor="surface.200"
      >
        <Container maxW="container.xl">
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={10}>
            <PrivacyPolicy />
            <UsageEthics />
          </SimpleGrid>
        </Container>
      </Box>

      <Box
        bg="surface.100"
        py={6}
        borderTop="1px solid"
        borderColor="surface.200"
      >
        <Container maxW="container.xl">
          <Flex
            direction={{ base: "column", md: "row" }}
            justify="space-between"
            align="center"
            gap={4}
          >
            <VStack align={{ base: "center", md: "start" }} spacing={0}>
              <Text fontSize="sm" fontWeight="bold" color="gray.400">
                Nabil Aba AI Manager
              </Text>
              <Text fontSize="xs" color="gray.600">
                © 2024 Audio Projects.
              </Text>
            </VStack>
            <HStack spacing={4}>
              <Link fontSize="xs" color="brand.500" onClick={onHireOpen}>
                Usage License
              </Link>
              <Divider orientation="vertical" h="15px" borderColor="gray.600" />
              <IconButton
                onClick={() => window.open("https://github.com/nabil-aba")}
                icon={<FaGithub />}
                size="sm"
                variant="ghost"
                color="gray.500"
                aria-label="GitHub"
              />
            </HStack>
          </Flex>
        </Container>
      </Box>

      <DownloadWarningModal
        isOpen={isDownloadOpen}
        onClose={onDownloadClose}
        item={selectedDownload}
      />

      <HireMeModal isOpen={isHireOpen} onClose={onHireClose} />
    </Box>
  );
}
