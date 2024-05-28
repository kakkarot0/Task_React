import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Typography, Box, CircularProgress } from "@mui/material";

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`https://hn.algolia.com/api/v1/items/${id}`);
        const jsonData = await response.json();
        setPost(jsonData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching post:', error);
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  return (
    <Container style={{ background: '#f2f6fc' }}>
      {loading ? (
        <Box display="flex" justifyContent="center" mt={2}>
          <CircularProgress />
        </Box>
      ) : (
        <Box mt={2}>
          <Typography variant="h4" gutterBottom>Post Details</Typography>
          <Typography variant="body1" component="pre">
            {JSON.stringify(post, null, 2)}
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default PostDetail;
