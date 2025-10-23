import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Paper,
  Typography,
  Box,
  Chip,
  Grid,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  MedicalServices,
  Visibility,
  Description,
} from '@mui/icons-material';
import { getMedicalRecords, getMedicalRecord } from '../redux/slices/recordsSlice';

const MedicalRecords = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { records, currentRecord, loading } = useSelector((state) => state.records);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(getMedicalRecords());
  }, [dispatch]);

  const handleViewRecord = (recordId) => {
    dispatch(getMedicalRecord(recordId));
    setViewDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setViewDialogOpen(false);
  };

  const getRecordTypeColor = (type) => {
    const colors = {
      prescription: 'primary',
      lab_report: 'secondary',
      imaging: 'info',
      vaccination: 'success',
      surgery: 'error',
      consultation: 'warning',
    };
    return colors[type] || 'default';
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          {t('medicalRecords')}
        </Typography>
        <Button variant="outlined" startIcon={<MedicalServices />}>
          Filter Records
        </Button>
      </Box>

      {loading && <Typography>Loading...</Typography>}

      {!loading && records.length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <MedicalServices sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="textSecondary">
            {t('noRecords')}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Your medical records will appear here once they are added by healthcare providers.
          </Typography>
        </Paper>
      )}

      <Grid container spacing={3}>
        {records.map((record) => (
          <Grid item xs={12} md={6} key={record._id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" component="div">
                    {record.metadata.title}
                  </Typography>
                  <Chip
                    label={record.recordType.replace('_', ' ').toUpperCase()}
                    color={getRecordTypeColor(record.recordType)}
                    size="small"
                  />
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Date: {new Date(record.metadata.date).toLocaleDateString()}
                </Typography>

                {record.metadata.description && (
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {record.metadata.description.substring(0, 100)}
                    {record.metadata.description.length > 100 ? '...' : ''}
                  </Typography>
                )}

                {record.metadata.diagnosis && (
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      Diagnosis:
                    </Typography>
                    <Typography variant="body2">
                      {record.metadata.diagnosis}
                    </Typography>
                  </Box>
                )}

                {record.prescriptions && record.prescriptions.length > 0 && (
                  <Chip
                    icon={<Description />}
                    label={`${record.prescriptions.length} Prescription(s)`}
                    size="small"
                    sx={{ mr: 1, mb: 1 }}
                  />
                )}

                {record.labResults && record.labResults.length > 0 && (
                  <Chip
                    icon={<Description />}
                    label={`${record.labResults.length} Lab Result(s)`}
                    size="small"
                    sx={{ mr: 1, mb: 1 }}
                  />
                )}

                <Box sx={{ mt: 2 }}>
                  <Button
                    size="small"
                    startIcon={<Visibility />}
                    onClick={() => handleViewRecord(record._id)}
                  >
                    View Details
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* View Record Dialog */}
      <Dialog open={viewDialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {currentRecord?.metadata.title}
        </DialogTitle>
        <DialogContent>
          {currentRecord && (
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Record Type: <Chip label={currentRecord.recordType} size="small" />
              </Typography>
              <Typography variant="body2" gutterBottom>
                Date: {new Date(currentRecord.metadata.date).toLocaleDateString()}
              </Typography>
              
              {currentRecord.metadata.description && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2">Description:</Typography>
                  <Typography variant="body2">{currentRecord.metadata.description}</Typography>
                </Box>
              )}

              {currentRecord.metadata.diagnosis && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2">Diagnosis:</Typography>
                  <Typography variant="body2">{currentRecord.metadata.diagnosis}</Typography>
                </Box>
              )}

              {currentRecord.prescriptions && currentRecord.prescriptions.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2">Prescriptions:</Typography>
                  {currentRecord.prescriptions.map((prescription, index) => (
                    <Paper key={index} sx={{ p: 2, mt: 1, bgcolor: 'background.default' }}>
                      <Typography variant="body2">
                        <strong>{prescription.medicineName}</strong>
                      </Typography>
                      <Typography variant="body2">
                        Dosage: {prescription.dosage} | Frequency: {prescription.frequency}
                      </Typography>
                      <Typography variant="body2">
                        Duration: {prescription.duration}
                      </Typography>
                      {prescription.instructions && (
                        <Typography variant="body2" color="text.secondary">
                          Instructions: {prescription.instructions}
                        </Typography>
                      )}
                    </Paper>
                  ))}
                </Box>
              )}

              {currentRecord.labResults && currentRecord.labResults.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2">Lab Results:</Typography>
                  {currentRecord.labResults.map((result, index) => (
                    <Paper key={index} sx={{ p: 2, mt: 1, bgcolor: 'background.default' }}>
                      <Typography variant="body2">
                        <strong>{result.testName}</strong>
                      </Typography>
                      <Typography variant="body2">
                        Value: {result.value} {result.unit}
                      </Typography>
                      <Typography variant="body2">
                        Normal Range: {result.normalRange}
                      </Typography>
                      <Chip
                        label={result.status}
                        size="small"
                        color={result.status === 'normal' ? 'success' : 'warning'}
                        sx={{ mt: 1 }}
                      />
                    </Paper>
                  ))}
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MedicalRecords;
