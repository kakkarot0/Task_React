


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

const Fetch = () => {
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [isFetching, setIsFetching] = useState(false);

    const fetchData = useCallback(async (page) => {
        try {
            const response = await fetch(`https://hn.algolia.com/api/v1/search_by_date?tags=story&page=${page}`);
            const jsonData = await response.json();
            setData(prevData => [...prevData, ...jsonData.hits]); // Append new data to existing data
            setCurrentPage(page + 1); // Increment page after fetching data from current page
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }, []);

    useEffect(() => {
        // Initial fetch
        fetchData(0);

        // Polling every 10 seconds
        const interval = setInterval(() => {
            fetchData(currentPage);
        }, 10000);

        return () => clearInterval(interval);
    }, [currentPage, fetchData]);

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

    const filteredData = data.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.author.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Container>
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
                    <ListItem key={index} divider>
                        <ListItemText
                            primary={item.title}
                            secondary={
                                <>
                                    <Typography variant="body2" color="textSecondary">Author: {item.author}</Typography>
                                    <Typography variant="body2" color="textSecondary">Number of Comments: {item.num_comments}</Typography>
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
