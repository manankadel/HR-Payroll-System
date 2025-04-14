import { Paper, Typography, List, ListItem, ListItemAvatar, ListItemText, Avatar, Box } from '@mui/material';

const TopLeaveTakers = ({ data }) => {
  return (
    <Paper sx={{ p: 3, mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Top Leave Takers
      </Typography>
      <List>
        {data.map((item, index) => (
          <ListItem key={index} sx={{ borderBottom: index !== data.length - 1 ? 1 : 0, borderColor: 'divider' }}>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: `${index < 3 ? 'error' : 'primary'}.main` }}>
                {index + 1}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={`${item.firstName} ${item.lastName}`}
              secondary={item.department}
            />
            <Box>
              <Typography variant="h6" color="primary">
                {item.totalDays}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                days
              </Typography>
            </Box>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default TopLeaveTakers;