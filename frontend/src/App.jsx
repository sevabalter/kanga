import React, { useState } from 'react';
import { Box, Button, Typography, styled, TextField } from '@mui/material';

const Container = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(4),
  backgroundColor: theme.palette.background.default,
}));

const QuestionBox = styled(Box)(({ theme }) => ({
  backgroundColor: '#ffffff',
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  width: '100%',
  maxWidth: 400,
  textAlign: 'center',
}));

const ChatBox = styled(Box)(({ theme }) => ({
  backgroundColor: '#ffffff',
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  width: '100%',
  maxWidth: 400,
}));

function App() {
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [answer, setAnswer] = useState('');

  const getNewQuestion = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch('https://kanga-production.up.railway.app/api/question');
      if (!response.ok) {
        throw new Error('Failed to get question');
      }
      const data = await response.json();
      setQuestion(data.question);
      setAnswer(''); // Clear answer when new question is loaded
    } catch (err) {
      setError('Error getting question');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!answer.trim()) return;

    try {
      const response = await fetch('https://kanga-production.up.railway.app/api/answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answer }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit answer');
      }

      // Clear the answer field after successful submission
      setAnswer('');
    } catch (err) {
      setError('Error submitting answer');
      console.error('Error:', err);
    }
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Math Question
      </Typography>
      <Button variant="contained" onClick={getNewQuestion} disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Get Question'}
      </Button>
      {error && (
        <Typography color="error" paragraph>
          {error}
        </Typography>
      )}
      {question && (
        <Box>
          <QuestionBox>
            <Typography variant="h5" component="p" gutterBottom>
              {question}
            </Typography>
          </QuestionBox>
          <ChatBox>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                variant="outlined"
                label="Your Answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                margin="normal"
                multiline
                rows={4}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={!answer.trim()}
              >
                Submit Answer
              </Button>
            </form>
          </ChatBox>
        </Box>
      )}
    </Container>
  );
}

export default App;
