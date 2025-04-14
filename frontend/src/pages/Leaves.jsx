import { useState, useEffect } from 'react';
import LeavePolicy from '../components/Leaves/LeavePolicy';
import TopLeaveTakers from '../components/Leaves/TopLeaveTakers';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  Dialog,
  IconButton,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  CalendarMonth as CalendarIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  EventNote as EventIcon
} from '@mui/icons-material';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { leaveService } from '../services/api';

const locales = {
  'en-US': require('date-fns/locale/en-US')
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales
});

const LEAVE_TYPES = [
  { id: 'annual', name: 'Annual Leave', color: '#4CAF50' },
  { id: 'sick', name: 'Sick Leave', color: '#F44336' },
  { id: 'casual', name: 'Casual Leave', color: '#2196F3' },
  { id: 'unpaid', name: 'Unpaid Leave', color: '#9E9E9E' }
];

const Leaves = () => {
  // States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openApplyLeave, setOpenApplyLeave] = useState(false);
  const [leaveBalance, setLeaveBalance] = useState({});
  const [leaveApplications, setLeaveApplications] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [topLeaveTakers, setTopLeaveTakers] = useState([]);
  const [viewMode, setViewMode] = useState('table');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    dateRange: [null, null]
  });
  const [newLeave, setNewLeave] = useState({
    type: '',
    startDate: null,
    endDate: null,
    reason: ''
  });

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [
          balanceRes,
          leavesRes,
          topTakersRes
        ] = await Promise.all([
          leaveService.getBalance(),
          leaveService.getAll(),
          leaveService.getTopTakers()
        ]);

        setLeaveBalance(balanceRes.data);
        setLeaveApplications(leavesRes.data);
        setTopLeaveTakers(topTakersRes.data);
        
        // Format calendar events
        const events = leavesRes.data
          .filter(leave => leave.status === 'approved')
          .map(leave => ({
            title: `${leave.employee.firstName} - ${leave.leaveType}`,
            start: new Date(leave.startDate),
            end: new Date(leave.endDate),
            color: LEAVE_TYPES.find(t => t.id === leave.leaveType)?.color
          }));
        setCalendarEvents(events);

      } catch (err) {
        setError('Failed to load leave data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Apply Leave Handler
  const handleApplyLeave = async () => {
    try {
      await leaveService.apply(newLeave);
      setOpenApplyLeave(false);
      // Refresh leave applications
      const res = await leaveService.getAll();
      setLeaveApplications(res.data);
    } catch (err) {
      setError('Failed to apply leave');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 20 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      )}

      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Leave Management</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <IconButton 
            onClick={() => setViewMode(viewMode === 'table' ? 'calendar' : 'table')}
            color={viewMode === 'calendar' ? 'primary' : 'default'}
          >
            <CalendarIcon />
          </IconButton>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenApplyLeave(true)}
          >
            Apply Leave
          </Button>
        </Box>
      </Box>

      {/* Leave Balance Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {LEAVE_TYPES.map(type => (
          <Grid item xs={12} sm={6} md={3} key={type.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {type.name}
                </Typography>
                <Typography 
                  variant="h3" 
                  sx={{ color: type.color, fontWeight: 'bold' }}
                >
                  {leaveBalance[type.id] || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Days Remaining
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={filters.status}
                label="Status"
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="approved">Approved</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Leave Type</InputLabel>
              <Select
                value={filters.type}
                label="Leave Type"
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              >
                <MenuItem value="all">All Types</MenuItem>
                {LEAVE_TYPES.map(type => (
                  <MenuItem key={type.id} value={type.id}>{type.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Main Content */}
      {viewMode === 'calendar' ? (
        <Paper sx={{ p: 2, height: 600 }}>
          <Calendar
            localizer={localizer}
            events={calendarEvents}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%' }}
            eventPropGetter={event => ({
              style: {
                backgroundColor: event.color
              }
            })}
          />
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Employee</TableCell>
                <TableCell>Leave Type</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leaveApplications
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((leave) => (
                  <TableRow key={leave._id}>
                    <TableCell>{leave.employee.firstName}</TableCell>
                    <TableCell>
                      <Chip 
                        label={LEAVE_TYPES.find(t => t.id === leave.leaveType)?.name}
                        sx={{ bgcolor: LEAVE_TYPES.find(t => t.id === leave.leaveType)?.color, color: 'white' }}
                      />
                    </TableCell>
                    <TableCell>{format(new Date(leave.startDate), 'PP')}</TableCell>
                    <TableCell>{format(new Date(leave.endDate), 'PP')}</TableCell>
                    <TableCell>
                      <Chip 
                        label={leave.status}
                        color={
                          leave.status === 'approved' ? 'success' :
                          leave.status === 'rejected' ? 'error' : 'warning'
                        }
                      />
                    </TableCell>
                    <TableCell>
                      {leave.status === 'pending' && (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton size="small" color="success">
                            <CheckIcon />
                          </IconButton>
                          <IconButton size="small" color="error">
                            <CloseIcon />
                          </IconButton>
                        </Box>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={leaveApplications.length}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
          />
        </TableContainer>
      )}

<Grid container spacing={3} sx={{ mt: 4 }}>
  <Grid item xs={12} md={8}>
    <LeavePolicy />
  </Grid>
  <Grid item xs={12} md={4}>
    <TopLeaveTakers data={topLeaveTakers} />
  </Grid>
</Grid>
        

      {/* Apply Leave Dialog */}
      <Dialog 
        open={openApplyLeave} 
        onClose={() => setOpenApplyLeave(false)}
        maxWidth="sm"
        fullWidth
      >
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Apply for Leave</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Leave Type</InputLabel>
                <Select
                  value={newLeave.type}
                  label="Leave Type"
                  onChange={(e) => setNewLeave({ ...newLeave, type: e.target.value })}
                >
                  {LEAVE_TYPES.map(type => (
                    <MenuItem key={type.id} value={type.id}>{type.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Reason"
                value={newLeave.reason}
                onChange={(e) => setNewLeave({ ...newLeave, reason: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button onClick={() => setOpenApplyLeave(false)}>Cancel</Button>
                <Button 
                  variant="contained"
                  onClick={handleApplyLeave}
                >
                  Submit
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Dialog>
    </Container>
  );
};

export default Leaves;