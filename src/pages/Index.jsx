import React, { useState, useEffect } from 'react';
import { Container, Text, VStack, Input, Box, Link, Flex, IconButton, useColorMode, useColorModeValue } from "@chakra-ui/react";
import { FaMoon, FaSun } from "react-icons/fa";
import axios from 'axios';

const Index = () => {
  const [stories, setStories] = useState([]);
  const [filteredStories, setFilteredStories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue("gray.100", "gray.900");
  const color = useColorModeValue("black", "white");

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const topStories = await axios.get('https://hacker-news.firebaseio.com/v0/topstories.json');
        const storyIds = topStories.data.slice(0, 5);
        const storyPromises = storyIds.map(id => axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`));
        const storiesData = await Promise.all(storyPromises);
        setStories(storiesData.map(story => story.data));
        setFilteredStories(storiesData.map(story => story.data));
      } catch (error) {
        console.error("Error fetching stories", error);
      }
    };

    fetchStories();
  }, []);

  useEffect(() => {
    setFilteredStories(
      stories.filter(story => story.title.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm, stories]);

  return (
    <Container centerContent maxW="container.md" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center" bg={bgColor} color={color}>
      <Flex justifyContent="flex-end" width="100%" p={4}>
        <IconButton aria-label="Toggle dark mode" icon={colorMode === "light" ? <FaMoon /> : <FaSun />} onClick={toggleColorMode} />
      </Flex>
      <VStack spacing={4} width="100%">
        <Text fontSize="2xl">Hacker News Top Stories</Text>
        <Input placeholder="Search stories..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        <VStack spacing={4} width="100%" overflowY="auto" maxHeight="70vh">
          {filteredStories.map(story => (
            <Box key={story.id} p={4} borderWidth="1px" borderRadius="lg" width="100%">
              <Text fontSize="lg" fontWeight="bold">{story.title}</Text>
              <Link href={story.url} isExternal color="teal.500">Read more</Link>
              <Text>Upvotes: {story.score}</Text>
            </Box>
          ))}
        </VStack>
      </VStack>
    </Container>
  );
};

export default Index;