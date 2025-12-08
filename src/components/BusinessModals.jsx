import { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  Text,
  SimpleGrid,
  Box,
  HStack,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useToast,
} from "@chakra-ui/react";
import { FaMicrophoneLines, FaEnvelope, FaDownload } from "react-icons/fa6";
import { FaExclamationTriangle, FaShieldAlt } from "react-icons/fa";

export const HireMeModal = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent
        bg="#161B22"
        border="1px solid"
        borderColor="surface.200"
        color="white"
      >
        <ModalHeader>Request Custom Audio</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack spacing={4} align="start">
            <Text color="gray.300">
              Need specific lines spoken by a specific character? I provide
              professional audio generation services tailored to your script.
            </Text>

            <SimpleGrid columns={2} spacing={4} w="full">
              <Box p={3} bg="surface.200" borderRadius="md">
                <HStack mb={2}>
                  <FaMicrophoneLines color="#D2A8FF" />
                  <Text fontWeight="bold" fontSize="sm">
                    Audio Request
                  </Text>
                </HStack>
                <Text fontSize="xs" color="gray.400">
                  You provide the script, I generate the high-fidelity audio
                  assets.
                </Text>
              </Box>
              <Box p={3} bg="surface.200" borderRadius="md">
                <HStack mb={2}>
                  <FaShieldAlt color="#7EE787" />
                  <Text fontWeight="bold" fontSize="sm">
                    Commercial Use
                  </Text>
                </HStack>
                <Text fontSize="xs" color="gray.400">
                  Get cleared rights to use the generated audio in your
                  projects.
                </Text>
              </Box>
            </SimpleGrid>

            <Alert
              status="info"
              variant="left-accent"
              bg="rgba(88, 166, 255, 0.1)"
              borderColor="blue.400"
            >
              <AlertIcon color="blue.400" />
              <Text fontSize="xs">
                Please include your script, desired character emotion, and
                deadline in your email.
              </Text>
            </Alert>
          </VStack>
        </ModalBody>
        <ModalFooter borderTop="1px solid" borderColor="surface.200">
          <Button
            variant="ghost"
            mr={3}
            onClick={onClose}
            color="gray.400"
            _hover={{ bg: "surface.200" }}
          >
            Cancel
          </Button>
          <Button
            as="a"
            href="mailto:nabilazizbimaanggita@gmail.com?subject=Audio%20Generation%20Request"
            leftIcon={<FaEnvelope />}
            colorScheme="blue"
            bg="blue.600"
            _hover={{ bg: "blue.500" }}
          >
            Send Request
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export const DownloadWarningModal = ({ isOpen, onClose, item }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const toast = useToast();

  const handleSecureDownload = async () => {
    if (!item) return;
    setIsDownloading(true);

    try {
      const response = await fetch(item.url);
      if (!response.ok) throw new Error("Network response was not ok");
      const blob = await response.blob();

      const originalExtension = item.url.split(".").pop().split("?")[0];
      const ext = ["wav", "mp3", "ogg"].includes(originalExtension)
        ? originalExtension
        : "wav";
      const filename = `[NabilAba]_${item.speaker.replace(/\s+/g, "_")}_${
        item.id
      }.${ext}`;

      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      toast({
        title: "Download Started",
        description: `Saving "${filename}"`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      toast({
        title: "Download Error",
        description: "Could not download the file. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={{ base: "xs", md: "lg" }}
      isCentered
      closeOnOverlayClick={false}
    >
      <ModalOverlay backdropFilter="blur(8px)" />
      <ModalContent
        bg="#161B22"
        border="1px solid"
        borderColor="red.900"
        color="white"
      >
        <ModalHeader borderBottom="1px solid" borderColor="surface.200">
          <HStack color="red.400">
            <FaExclamationTriangle />
            <Text fontSize="md">RESTRICTED ASSET DOWNLOAD</Text>
          </HStack>
        </ModalHeader>
        <ModalCloseButton isDisabled={isDownloading} />
        <ModalBody pt={6}>
          <Alert
            status="error"
            variant="subtle"
            bg="rgba(255,0,0,0.1)"
            color="red.200"
            borderRadius="md"
            mb={4}
          >
            <AlertIcon color="red.400" />
            <Box>
              <AlertTitle fontSize="sm">
                Deepfake & AI Voice Usage Warning
              </AlertTitle>
              <AlertDescription fontSize="xs">
                This asset is a high-fidelity voice clone generated by Nabil
                Aba.
              </AlertDescription>
            </Box>
          </Alert>
          <VStack align="start" spacing={3} fontSize="sm" color="gray.300">
            <Text>
              By downloading <b>{item?.speaker}'s</b> voice asset, you agree to
              the following:
            </Text>
            <Box as="ul" pl={4} style={{ listStyleType: "disc" }}>
              <Box as="li">
                You will <b>not</b> use this audio for commercial purposes.
              </Box>
              <Box as="li">
                You will <b>not</b> use this to misrepresent the original
                speaker.
              </Box>
              <Box as="li">
                You must credit <b>Nabil Aba AI</b>.
              </Box>
              <Box as="li">
                Any legal consequences arising from misuse are your sole
                responsibility.
              </Box>
            </Box>
          </VStack>
        </ModalBody>
        <ModalFooter borderTop="1px solid" borderColor="surface.200">
          <Button
            variant="ghost"
            mr={3}
            onClick={onClose}
            color="gray.400"
            _hover={{ bg: "surface.200" }}
            isDisabled={isDownloading}
            size="sm"
          >
            Cancel
          </Button>
          <Button
            leftIcon={<FaDownload />}
            colorScheme="red"
            onClick={handleSecureDownload}
            isLoading={isDownloading}
            loadingText="Downloading..."
            size="sm"
          >
            I Agree & Download
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
