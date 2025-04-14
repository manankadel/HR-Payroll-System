import { Paper, Typography, Box, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Circle } from '@mui/icons-material';

const LeavePolicy = () => {
  const policies = [
    {
      type: 'Annual Leave',
      days: 20,
      rules: [
        'Must be applied 1 week in advance',
        'Maximum 15 days at a stretch',
        'Cannot be carried forward to next year'
      ]
    },
    {
      type: 'Sick Leave',
      days: 10,
      rules: [
        'Medical certificate required for more than 2 days',
        'Can be applied retroactively',
        'Half-day leaves allowed'
      ]
    },
    {
      type: 'Casual Leave',
      days: 5,
      rules: [
        'Maximum 2 days at a stretch',
        'Cannot be combined with other leave types',
        'Prior intimation required'
      ]
    }
  ];

  return (
    <Paper sx={{ p: 3, mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Leave Policy
      </Typography>
      {policies.map((policy) => (
        <Box key={policy.type} sx={{ mb: 3 }}>
          <Typography variant="subtitle1" color="primary" gutterBottom>
            {policy.type} ({policy.days} days per year)
          </Typography>
          <List dense>
            {policy.rules.map((rule, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <Circle sx={{ fontSize: 8 }} />
                </ListItemIcon>
                <ListItemText primary={rule} />
              </ListItem>
            ))}
          </List>
        </Box>
      ))}
    </Paper>
  );
};

export default LeavePolicy;