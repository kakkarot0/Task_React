

import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  TextField,
  List,
  ListItem,
  ListItemText,
  Typography,
  CircularProgress,
  Box
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Fetch = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [isPolling, setIsPolling] = useState(false);

  const navigate = useNavigate();

  const fetchData = useCallback(async (page) => {
    try {
      const response = await fetch(`https://hn.algolia.com/api/v1/search_by_date?tags=story&page=${page}`);
      const jsonData = await response.json();
      setData(prevData => [...prevData, ...jsonData.hits]);
      setCurrentPage(page + 1);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, []);

  useEffect(() => {
    fetchData(0);
  }, [fetchData]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsPolling(true);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isPolling) {
      fetchData(currentPage);
      setIsPolling(false);
    }
  }, [isPolling, currentPage, fetchData]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || isFetching) {
        return;
      }
      setIsFetching(true);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isFetching]);

  useEffect(() => {
    if (!isFetching) return;

    fetchData(currentPage).then(() => {
      setIsFetching(false);
    });
  }, [isFetching, currentPage, fetchData]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleItemClick = (item) => {
    navigate(`/post/${item.objectID}`);
  };

  const filteredData = data.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container style={{ background: '#f2f6fc' }}>
      <Typography variant="h2" gutterBottom>Latest Stories</Typography>
      <TextField
        fullWidth
        label="Search by title or author"
        variant="outlined"
        value={searchTerm}
        onChange={handleSearch}
        margin="normal"
      />
      <List>
        {filteredData.map((item, index) => (
          <ListItem key={index} divider button onClick={() => handleItemClick(item)}>
            <ListItemText
              primary={item.title}
              secondary={
                <>
                  <Typography variant="body2" color="textSecondary">Author: {item.author}</Typography>
                  <Typography variant="body2" color="textSecondary">Created At: {item.created_at}</Typography>
                  <Typography variant="body2" color="textSecondary">Tags: {item._tags.join(', ')}</Typography>
                </>
              }
            />
          </ListItem>
        ))}
      </List>
      {isFetching && (
        <Box display="flex" justifyContent="center" mt={2}>
          <CircularProgress />
        </Box>
      )}
    </Container>
  );
};

export default Fetch;
