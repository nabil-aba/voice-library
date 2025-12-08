import {
  Box,
  Heading,
  HStack,
  Text,
  List,
  ListItem,
  ListIcon,
  SimpleGrid,
  Icon,
} from "@chakra-ui/react";
import {
  FaUserSecret,
  FaCookie,
  FaServer,
  FaShieldAlt,
  FaExclamationTriangle,
  FaBan,
  FaUserCheck,
} from "react-icons/fa";

export const PrivacyPolicy = () => (
  <Box
    bg="surface.100"
    p={6}
    borderRadius="xl"
    border="1px solid"
    borderColor="surface.200"
    position="relative"
    overflow="hidden"
  >
    <Box
      position="absolute"
      top="-10px"
      right="-10px"
      opacity={0.05}
      transform="rotate(15deg)"
    >
      <FaUserSecret size={150} />
    </Box>

    <HStack mb={4} spacing={3}>
      <Box
        p={2}
        bg="rgba(88, 166, 255, 0.2)"
        borderRadius="md"
        color="blue.400"
      >
        <FaUserSecret size={20} />
      </Box>
      <Heading size="md" color="white">
        Privacy Policy
      </Heading>
    </HStack>

    <Text fontSize="sm" color="gray.400" mb={4} lineHeight="1.6">
      We value transparency. This platform operates as a static asset
      repository. Here is how we handle data:
    </Text>

    <List spacing={3}>
      <ListItem display="flex" alignItems="start">
        <ListIcon as={FaCookie} color="blue.400" mt={1} />
        <Box>
          <Text fontSize="sm" fontWeight="bold" color="gray.200">
            Zero Cookies
          </Text>
          <Text fontSize="xs" color="gray.500">
            We do not track browsing behavior or use tracking cookies.
          </Text>
        </Box>
      </ListItem>
      <ListItem display="flex" alignItems="start">
        <ListIcon as={FaServer} color="blue.400" mt={1} />
        <Box>
          <Text fontSize="sm" fontWeight="bold" color="gray.200">
            Server Logs
          </Text>
          <Text fontSize="xs" color="gray.500">
            Basic download logs (IP & Timestamp) are retained for 30 days solely
            for security auditing.
          </Text>
        </Box>
      </ListItem>
      <ListItem display="flex" alignItems="start">
        <ListIcon as={FaShieldAlt} color="blue.400" mt={1} />
        <Box>
          <Text fontSize="sm" fontWeight="bold" color="gray.200">
            Local Processing
          </Text>
          <Text fontSize="xs" color="gray.500">
            Audio playback happens entirely within your browser.
          </Text>
        </Box>
      </ListItem>
    </List>
  </Box>
);

export const UsageEthics = () => (
  <Box
    bg="surface.100"
    p={6}
    borderRadius="xl"
    border="1px solid"
    borderColor="red.900"
    position="relative"
    overflow="hidden"
  >
    <Box
      position="absolute"
      top="-10px"
      right="-10px"
      opacity={0.05}
      transform="rotate(15deg)"
    >
      <FaExclamationTriangle size={150} color="red" />
    </Box>

    <HStack mb={4} spacing={3}>
      <Box p={2} bg="rgba(248, 81, 73, 0.2)" borderRadius="md" color="red.400">
        <FaExclamationTriangle size={20} />
      </Box>
      <Heading size="md" color="white">
        Usage Ethics
      </Heading>
    </HStack>

    <Text fontSize="sm" color="gray.400" mb={4} lineHeight="1.6">
      Voice synthesis technology is powerful but carries risks. By using this
      library, you agree to our <b>Zero Tolerance Policy</b>.
    </Text>

    <SimpleGrid columns={1} spacing={3}>
      <Box
        bg="rgba(248, 81, 73, 0.1)"
        p={3}
        borderRadius="md"
        borderLeft="3px solid"
        borderColor="red.400"
      >
        <HStack mb={1}>
          <Icon as={FaBan} color="red.400" />
          <Text fontSize="xs" fontWeight="bold" color="red.200">
            STRICTLY PROHIBITED
          </Text>
        </HStack>
        <Text fontSize="xs" color="gray.400">
          Deepfakes, political disinformation, hate speech, fraud/scams, or
          commercial use without a valid license from the original voice actor.
        </Text>
      </Box>

      <Box
        bg="rgba(35, 134, 54, 0.1)"
        p={3}
        borderRadius="md"
        borderLeft="3px solid"
        borderColor="green.400"
      >
        <HStack mb={1}>
          <Icon as={FaUserCheck} color="green.400" />
          <Text fontSize="xs" fontWeight="bold" color="green.200">
            PERMITTED USE
          </Text>
        </HStack>
        <Text fontSize="xs" color="gray.400">
          Personal research, non-commercial fan projects (clearly labeled as
          AI), accessibility testing, and educational prototyping.
        </Text>
      </Box>
    </SimpleGrid>
  </Box>
);
