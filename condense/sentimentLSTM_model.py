import torch
import torch.nn as nn


class SentimentLSTM(nn.Module):
    def __init__(
        self, vocab_size: int, embedding_dim: int, hidden_dim: int, output_dim: int, num_layers: int, dropout: float
    ):
        """
        Initializes the SentimentLSTM model.

        Parameters:
            vocab_size (int): The size of the vocabulary.
            embedding_dim (int): The dimension of the word embeddings.
            hidden_dim (int): The dimension of the hidden layer in the LSTM.
            output_dim (int): The dimension of the output.
            num_layers (int): The number of LSTM layers.
            dropout (float): The dropout probability.
        """
        super(SentimentLSTM, self).__init__()
        self.embedding = nn.Embedding(vocab_size, embedding_dim)
        self.lstm = nn.LSTM(embedding_dim, hidden_dim, num_layers, dropout=dropout, batch_first=True)
        self.fc = nn.Linear(hidden_dim, output_dim)
        self.dropout = nn.Dropout(dropout)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        """
        Performs forward pass through the model.

        Parameters:
            x (torch.Tensor): The input tensor.

        Returns:
            torch.Tensor: The output tensor.
        """
        embedded = self.embedding(x)
        lstm_out, _ = self.lstm(embedded)
        lstm_out = self.dropout(lstm_out)
        output = self.fc(lstm_out[:, -1, :])  # get output from last time step
        return output
