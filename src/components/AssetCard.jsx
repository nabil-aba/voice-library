import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Flex,
  HStack,
  Text,
  Badge,
  IconButton,
  Collapse,
  SimpleGrid,
  Tooltip,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  VStack,
} from "@chakra-ui/react";
import {
  FaCheck,
  FaRegCopy,
  FaChevronUp,
  FaChevronDown,
  FaHeart,
  FaRegHeart,
  FaPause,
  FaPlay,
  FaTachometerAlt,
  FaDownload,
  FaVolumeUp,
} from "react-icons/fa";
import WaveSurfer from "wavesurfer.js";

export const ScriptCard = ({
  script,
  currentPlayingRef,
  setCurrentPlayingRef,
  onDownload,
  favorites,
  toggleFavorite,
  showFavoritesOnly,
  onHireOpen,
}) => {
  const visibleVariations = script.variations.filter(
    (v) => !showFavoritesOnly || favorites.includes(v.id)
  );
  if (visibleVariations.length === 0) return null;

  const containsFavorite = script.variations.some((v) =>
    favorites.includes(v.id)
  );
  const { isOpen, onToggle } = useDisclosure({
    defaultIsOpen: containsFavorite || showFavoritesOnly,
  });

  const [hasCopied, setHasCopied] = useState(false);
  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(script.text);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  return (
    <Box
      bg="surface.100"
      borderRadius="lg"
      border="1px solid"
      borderColor={isOpen ? "brand.500" : "surface.200"}
      overflow="hidden"
      transition="all 0.2s"
    >
      <Flex
        p={{ base: 3, md: 5 }}
        onClick={onToggle}
        cursor="pointer"
        align="flex-start"
        justify="space-between"
        bg={isOpen ? "rgba(255,255,255,0.02)" : "transparent"}
      >
        <Box flex="1" minW={0}>
          <HStack mb={2} wrap="wrap" spacing={2}>
            <Badge
              bg="surface.300"
              color="gray.400"
              fontSize="10px"
              px={2}
              borderRadius="full"
            >
              {script.id}
            </Badge>
            {script.tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                colorScheme="gray"
                fontSize="10px"
                opacity={0.7}
                borderRadius="full"
              >
                {tag}
              </Badge>
            ))}
          </HStack>

          <HStack align="start" spacing={3}>
            <Text
              fontSize={{ base: "sm", md: "lg" }}
              fontWeight="medium"
              color="white"
              lineHeight="1.5"
              noOfLines={isOpen ? 0 : 2}
            >
              "{script.text}"
            </Text>

            <IconButton
              icon={hasCopied ? <FaCheck /> : <FaRegCopy />}
              size="xs"
              variant="ghost"
              color={hasCopied ? "green.400" : "gray.600"}
              onClick={handleCopy}
              aria-label="Copy text"
              minW="auto"
            />
          </HStack>
        </Box>

        <Box ml={4} pt={1}>
          <IconButton
            icon={isOpen ? <FaChevronUp /> : <FaChevronDown />}
            variant="ghost"
            size="sm"
            color="gray.500"
            aria-label="Toggle"
            borderRadius="full"
          />
        </Box>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <Box
          bg="#0D1117"
          borderTop="1px solid"
          borderColor="surface.200"
          p={{ base: 2, md: 3 }}
        >
          <SimpleGrid columns={1} spacing={0}>
            {visibleVariations.map((variant) => (
              <WaveformRow
                key={variant.id}
                variant={variant}
                currentPlayingRef={currentPlayingRef}
                setCurrentPlayingRef={setCurrentPlayingRef}
                onDownload={onDownload}
                isFavorite={favorites.includes(variant.id)}
                toggleFavorite={() => toggleFavorite(variant.id)}
                onHireOpen={onHireOpen}
              />
            ))}
          </SimpleGrid>
        </Box>
      </Collapse>
    </Box>
  );
};

const WaveformRow = ({
  variant,
  currentPlayingRef,
  setCurrentPlayingRef,
  onDownload,
  isFavorite,
  toggleFavorite,
  onHireOpen,
}) => {
  const containerRef = useRef(null);
  const wavesurfer = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [volume, setVolume] = useState(1);

  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    if (!containerRef.current) return;

    const controller = new AbortController();
    const signal = controller.signal;

    const ws = WaveSurfer.create({
      container: containerRef.current,
      waveColor: "#30363D",
      progressColor: "#238636",
      cursorColor: "#58A6FF",
      barWidth: 2,
      barGap: 3,
      responsive: true,
      height: 30,
      normalize: true,
      backend: "MediaElement",
    });

    wavesurfer.current = ws;

    const isSoundHelix = variant.url.includes("soundhelix.com");
    const url = isSoundHelix
      ? `https://api.allorigins.win/raw?url=${encodeURIComponent(variant.url)}`
      : variant.url;

    fetch(url, { signal })
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.blob();
      })
      .then((blob) => {
        if (isMounted.current && ws) {
          const audioUrl = URL.createObjectURL(blob);
          ws.load(audioUrl);
        }
      })
      .catch((err) => {});

    ws.on("ready", () => {
      if (isMounted.current) {
        setIsReady(true);
        const dur = ws.getDuration();
        setDuration(formatTime(dur));
        ws.setVolume(volume);
      }
    });

    ws.on("play", () => {
      if (isMounted.current) {
        setIsPlaying(true);
        if (currentPlayingRef && currentPlayingRef !== ws) {
          currentPlayingRef.pause();
        }
        setCurrentPlayingRef(ws);
      }
    });

    ws.on("pause", () => {
      if (isMounted.current) setIsPlaying(false);
    });
    ws.on("finish", () => {
      if (isMounted.current) setIsPlaying(false);
    });

    return () => {
      isMounted.current = false;
      controller.abort();
      if (ws) {
        ws.unAll();
        ws.pause();
        setTimeout(() => {
          try {
            ws.destroy();
          } catch (e) {}
        }, 0);
      }
    };
  }, [variant.url]);

  useEffect(() => {
    if (wavesurfer.current && isReady) {
      try {
        wavesurfer.current.setPlaybackRate(playbackRate);
      } catch (e) {}
    }
  }, [playbackRate, isReady]);

  useEffect(() => {
    if (wavesurfer.current && isReady) {
      try {
        wavesurfer.current.setVolume(volume);
      } catch (e) {}
    }
  }, [volume, isReady]);

  const formatTime = (seconds) => {
    if (!seconds) return "00:00";
    const minutes = Math.floor(seconds / 60);
    const secondsRemainder = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 10);
    return `${minutes}:${secondsRemainder.toString().padStart(2, "0")}.${ms}s`;
  };

  const handlePlayPause = (e) => {
    e.stopPropagation();
    if (wavesurfer.current && isReady) {
      wavesurfer.current.playPause();
    }
  };

  return (
    <Flex
      position="relative"
      overflow="hidden"
      bg="surface.100"
      my={2}
      p={{ base: 2, md: 3 }}
      align="center"
      borderRadius="md"
      border="1px solid"
      borderColor={isPlaying ? "brand.500" : "transparent"}
      _hover={{
        borderColor: isPlaying ? "brand.500" : "gray.600",
        "& .bg-image-layer": {
          transform: "scale(1.05)",
          opacity: 0.35,
        },
      }}
      gap={{ base: 2, md: 3 }}
      transition="all 0.3s ease"
      role="group"
      boxShadow={isPlaying ? "0 4px 12px rgba(0,0,0,0.3)" : "none"}
    >
      <style>
        {`
          @keyframes cinematicDrift {
            0% { background-position: 0% 50%; }
            100% { background-position: 100% 50%; }
          }
        `}
      </style>

      {/* 1. BACKGROUND IMAGE LAYER */}
      <Box
        className="bg-image-layer"
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        zIndex={0}
        backgroundImage={`url(${variant.avatar})`}
        backgroundSize="cover"
        backgroundPosition="center"
        opacity={isPlaying ? 0.35 : 0.15}
        filter="grayscale(100%) contrast(1.1)"
        animation="cinematicDrift 45s ease-in-out infinite alternate"
        transition="opacity 0.5s ease, transform 6s ease"
        pointerEvents="none"
      />

      {/* 2. GRADIENT OVERLAY LAYER - Ensures Text Readability */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        zIndex={0}
        bgGradient="linear(to-r, #0D1117 15%, rgba(13,17,23, 0.95) 30%, rgba(13,17,23, 0.7) 60%, transparent 100%)"
        pointerEvents="none"
      />

      {/* 3. CONTENT (Z-Index 1) */}
      <HStack spacing={1} flexShrink={0} zIndex={1} position="relative">
        <IconButton
          icon={isFavorite ? <FaHeart /> : <FaRegHeart />}
          size="xs"
          variant="ghost"
          color={isFavorite ? "like.500" : "gray.600"}
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite();
          }}
          aria-label="Favorite"
          _hover={{ color: "like.500", bg: "whiteAlpha.100" }}
        />
        <IconButton
          icon={
            isPlaying ? <FaPause size={10} /> : <FaPlay size={10} ml="2px" />
          }
          onClick={handlePlayPause}
          size="sm"
          colorScheme={isPlaying ? "green" : "gray"}
          variant={isPlaying ? "solid" : "outline"}
          isRound
          aria-label="Play"
          isLoading={!isReady}
          boxShadow={isPlaying ? "0 0 10px rgba(35, 134, 54, 0.6)" : "none"}
          _groupHover={{
            bg: isPlaying ? "brand.500" : "whiteAlpha.100",
            borderColor: isPlaying ? "brand.500" : "gray.400",
          }}
        />
      </HStack>

      {/* Speaker Info + Duration */}
      <HStack
        w={{ base: "auto", md: "120px" }}
        spacing={3}
        flexShrink={0}
        zIndex={1}
        position="relative"
      >
        <VStack
          align="start"
          spacing={0}
          maxW={{ base: "100px", sm: "140px" }}
          overflow="hidden"
        >
          <Text
            fontSize={{ base: "xs", md: "sm" }}
            fontWeight="bold"
            color="white"
            isTruncated
            w="full"
          >
            {variant.speaker}
          </Text>
          <Text
            fontSize="10px"
            color="gray.400"
            fontFamily="mono"
            lineHeight="shorter"
          >
            {duration || "--:--"}
          </Text>
        </VStack>
      </HStack>

      {/* Waveform */}
      <Box
        flex="1"
        mx={2}
        opacity={isReady ? 1 : 0.5}
        overflow="hidden"
        zIndex={1}
        position="relative"
      >
        <div ref={containerRef} style={{ width: "100%" }} />
      </Box>

      {/* Right Controls */}
      <HStack
        spacing={0}
        ml="auto"
        flexShrink={0}
        zIndex={1}
        position="relative"
      >
        <Box display={{ base: "none", md: "flex" }}>
          <Popover
            placement="top"
            trigger="hover"
            openDelay={0}
            closeDelay={200}
          >
            <PopoverTrigger>
              <IconButton
                icon={<FaVolumeUp />}
                size="xs"
                variant="ghost"
                color="gray.500"
                aria-label="Volume"
                _hover={{ bg: "whiteAlpha.200", color: "white" }}
              />
            </PopoverTrigger>
            <PopoverContent
              w="40px"
              bg="surface.300"
              borderColor="surface.200"
              _focus={{ outline: "none" }}
            >
              <PopoverBody
                p={2}
                display="flex"
                justifyContent="center"
                height="100px"
              >
                <Slider
                  aria-label="volume-slider"
                  orientation="vertical"
                  min={0}
                  max={1}
                  step={0.1}
                  value={volume}
                  onChange={(val) => setVolume(val)}
                >
                  <SliderTrack bg="gray.600">
                    <SliderFilledTrack bg="brand.500" />
                  </SliderTrack>
                  <SliderThumb boxSize={3} />
                </Slider>
              </PopoverBody>
            </PopoverContent>
          </Popover>

          <Menu>
            <MenuButton
              as={IconButton}
              icon={<FaTachometerAlt />}
              size="xs"
              variant="ghost"
              color={playbackRate !== 1 ? "brand.500" : "gray.500"}
              aria-label="Speed"
              _hover={{ bg: "whiteAlpha.200", color: "white" }}
            />
            <MenuList
              bg="surface.300"
              border="none"
              minW="100px"
              fontSize="xs"
              zIndex={10}
            >
              <MenuItem bg="surface.300" onClick={() => setPlaybackRate(0.5)}>
                0.5x Slow
              </MenuItem>
              <MenuItem bg="surface.300" onClick={() => setPlaybackRate(1.0)}>
                1.0x Normal
              </MenuItem>
              <MenuItem bg="surface.300" onClick={() => setPlaybackRate(1.5)}>
                1.5x Fast
              </MenuItem>
            </MenuList>
          </Menu>
        </Box>

        <Tooltip
          label="Download"
          hasArrow
          bg="red.900"
          color="white"
          placement="left"
        >
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              onDownload(variant);
            }}
            icon={<FaDownload />}
            size="sm"
            variant="ghost"
            color="gray.500"
            ml={{ base: 0, md: 1 }}
            _hover={{ color: "red.400", bg: "rgba(255,0,0,0.2)" }}
            aria-label="Download"
          />
        </Tooltip>
      </HStack>
    </Flex>
  );
};
