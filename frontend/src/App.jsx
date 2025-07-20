import React, { useState } from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';

const QuizContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(4),
  gap: theme.spacing(4),
  backgroundColor: '#f5f5f5',
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

function App() {
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const getNewQuestion = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:3001/api/question');
      if (!response.ok) {
        throw new Error('Failed to get question');
      }
      const data = await response.json();
      setQuestion(data.question);
    } catch (err) {
      setError('Error getting question');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <QuizContainer>
      <QuestionBox>
        <Typography variant="h4" component="h1" gutterBottom>
          Math Question
        </Typography>
        {error && (
          <Typography color="error" variant="h6">
            {error}
          </Typography>
        )}
        <Typography variant="h5" component="p" gutterBottom>
          {question}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={getNewQuestion}
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={20} /> : undefined}
          sx={{
            marginTop: 2,
            padding: '12px 24px',
            fontSize: '1.1rem',
            borderRadius: 2,
          }}
        >
          {isLoading ? 'Generating...' : 'New Question'}
        </Button>
      </QuestionBox>
    </QuizContainer>
  );
}

export default App;
