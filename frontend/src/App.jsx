import React, { useState } from 'react';
import { Box, Button, Typography, styled, TextField, Dialog, DialogTitle, DialogContent, DialogContentText } from '@mui/material';

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
  const [messages, setMessages] = useState([]);
  const [validationResult, setValidationResult] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [showApiDetails, setShowApiDetails] = useState(false);
  const [apiDetails, setApiDetails] = useState('');

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!answer.trim()) return;

    // Add the message to the chat
    setMessages(prev => [...prev, { text: answer, isUser: true }]);
    setAnswer('');
  };

  const handleValidate = async () => {
    if (!question || !answer.trim()) return;
    setIsChecking(true);
    setValidationResult('');

    try {
      const response = await fetch('https://kanga-production.up.railway.app/api/answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          answer: answer.trim()
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to validate answer');
      }

      const result = await response.text();
      setValidationResult(result);

      // Capture the API details
      const apiDetails = {
        request: {
          url: 'https://kanga-production.up.railway.app/api/answer',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: {
            question,
            answer: answer.trim()
          }
        },
        response: {
          status: response.status,
          statusText: response.statusText,
          result
        }
      };

      // Format the details for display
      setApiDetails(JSON.stringify(apiDetails, null, 2));
      setShowApiDetails(true);
    } catch (err) {
      setError('Error validating answer');
      console.error('Error:', err);
    } finally {
      setIsChecking(false);
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
            <Box sx={{ maxHeight: '300px', overflowY: 'auto', mb: 2 }}>
              {messages.map((message, index) => (
                <Box
                  key={index}
                  sx={{
                    mb: 2,
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: message.isUser ? '#e3f2fd' : '#f5f5f5',
                    textAlign: message.isUser ? 'right' : 'left',
                  }}
                >
                  <Typography>{message.text}</Typography>
                </Box>
              ))}
              {validationResult && (
                <Box
                  sx={{
                    mb: 2,
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: validationResult === 'Correct' ? '#e8f5e9' : '#ffebee',
                    textAlign: 'center',
                  }}
                >
                  <Typography
                    color={validationResult === 'Correct' ? 'success.main' : 'error.main'}
                  >
                    {validationResult}
                  </Typography>
                </Box>
              )}
            </Box>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                variant="outlined"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                margin="normal"
                multiline
                rows={4}
                inputMode="numeric"
                type="number"
                disabled={isLoading || isChecking}
                placeholder="Enter your answer..."
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={!answer.trim()}
              >
                Send
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleValidate}
                disabled={!answer.trim() || isChecking}
                sx={{ ml: 2 }}
              >
                {isChecking ? 'Checking...' : 'Validate'}
              </Button>
            </form>
          </ChatBox>
        </Box>
      )}

      {/* OpenAI API Details Popup */}
      <Dialog
        open={showApiDetails}
        onClose={() => setShowApiDetails(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>OpenAI API Details</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <pre style={{ whiteSpace: 'pre-wrap', backgroundColor: '#f5f5f5', padding: '16px', borderRadius: '4px', fontSize: '14px', lineHeight: '1.5' }}>
              {apiDetails}
            </pre>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </Container>
  );
}

export default App;
