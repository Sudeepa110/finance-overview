import React, { useEffect, useState } from 'react';
import DataGridTable from '../components/DataGridTable';
import { collection, getDocs, deleteDoc, doc, getDoc, addDoc, updateDoc } from "firebase/firestore";
import { db } from '../firebase';
import Button from '@mui/material/Button';
import columns from '../components/columns/EmiColumns';
import {
    GridActionsCellItem,
} from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions, 
    TextField, 
    FormControl, 
    InputLabel, 
    Select, 
    MenuItem,
    Grid,
    Box
} from '@mui/material';

const Emi = () => {
    const recordsCollectionRef = collection(db, "emis");
    const loansCollectionRef = collection(db, "loans");
    const [records, setRecords] = useState([]);
    const [editData, setEditData] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [recordColumns, setRecordColumns] = useState(columns);
    const [loanEmails, setLoanEmails] = useState([]);
    const [formData, setFormData] = useState({
        email: '',
        emiAmount: '', // Changed from amount to match column field
        remainingLoanAmount: '',
        totalPayment: '',
        totalEMIPaid: '', // Added to match column field
        loanAmount: '',
        interestRate: '',
        loanTerm: '',
        startDate: '',
        endDate: '',
        status: 'Pending',
        paid: false
    });
    const [saveLoading, setSaveLoading] = useState(false);
    const [error, setError] = useState('');

    const getClients = async () => {
        try {
            const clientsData = await getDocs(loansCollectionRef);
            const emails = clientsData.docs.map((doc) => ({ email: doc.id }));
            setLoanEmails(emails);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    useEffect(() => {
        getClients();
        const hasActionColumn = columns.some((col) => col.field === 'actions');
        if (!hasActionColumn) {
            const actionColumn = {
                field: 'actions',
                type: 'actions',
                headerName: 'Actions',
                width: 100,
                cellClassName: 'actions',
                getActions: ({ id }) => {
                    return [
                        <GridActionsCellItem
                            icon={<EditIcon />}
                            label="Edit"
                            onClick={() => handleEditClick(id)}
                            color="inherit"
                        />,
                        <GridActionsCellItem
                            icon={<DeleteIcon />}
                            label="Delete"
                            onClick={() => handleDeleteClick(id)}
                            color="inherit"
                        />,
                    ];
                },
            };

            setRecordColumns([...columns, actionColumn]);
        }
        setLoading(false);
        getEmis();
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return dateString;
    };

    const formatTimestamp = (timestamp) => {
        if (!timestamp) return '';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleEditClick = async (id) => {
        try {
            const recordDocRef = doc(recordsCollectionRef, id);
            const recordDoc = await getDoc(recordDocRef);
            if (recordDoc.exists()) {
                const recordData = { id: recordDoc.id, ...recordDoc.data() };
                setEditData(recordData);
                setFormData({
                    email: recordData.email || '',
                    emiAmount: recordData.emiAmount || recordData.amount || '', // Support both field names
                    remainingLoanAmount: recordData.remainingLoanAmount || '',
                    totalPayment: recordData.totalPayment || '',
                    totalEMIPaid: recordData.totalEMIPaid || '',
                    loanAmount: recordData.loanAmount || '',
                    interestRate: recordData.interestRate || '',
                    loanTerm: recordData.loanTerm || '',
                    startDate: recordData.startDate || '',
                    endDate: recordData.endDate || '',
                    paid: recordData.paid || false,
                    status: recordData.status || 'Pending'
                });
                setShowModal(true);
            } else {
                console.log("No such document found!");
            }
        } catch (error) {
            console.error("Error fetching record:", error);
        }
    };

    const handleDeleteClick = async (id) => {
        confirmAlert({
            title: 'Confirm to delete',
            message: 'Are you sure you want to delete this EMI?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => handleDelete(id)
                },
                {
                    label: 'No',
                    onClick: () => { }
                }
            ]
        });
    };

    const handleDelete = async (id) => {
        try {
            const recordDocRef = doc(recordsCollectionRef, id);
            await deleteDoc(recordDocRef);
            console.log(`Record with ID ${id} deleted successfully.`);
            setRecords((prevRecords) => prevRecords.filter(record => record.id !== id));
        } catch (error) {
            console.error("Error deleting record:", error);
        }
    }

    const hideModal = () => {
        setShowModal(false);
        setEditData(null);
        setFormData({
            email: '',
            emiAmount: '',
            remainingLoanAmount: '',
            totalPayment: '',
            totalEMIPaid: '',
            loanAmount: '',
            interestRate: '',
            loanTerm: '',
            startDate: '',
            endDate: '',
            paid: false,
            status: 'Pending'
        });
        setError('');
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaveLoading(true);
        setError('');
        
        try {
            const emiData = {
                email: formData.email,
                emiAmount: parseFloat(formData.emiAmount) || 0, // Changed field name
                amount: parseFloat(formData.emiAmount) || 0, // Keep old field for compatibility
                remainingLoanAmount: parseFloat(formData.remainingLoanAmount) || 0,
                totalPayment: parseFloat(formData.totalPayment) || 0,
                totalEMIPaid: parseFloat(formData.totalEMIPaid) || 0,
                loanAmount: parseFloat(formData.loanAmount) || 0,
                interestRate: parseFloat(formData.interestRate) || 0,
                loanTerm: parseInt(formData.loanTerm) || 0,
                startDate: formData.startDate,
                endDate: formData.endDate,
                paid: formData.status === 'Paid',
                status: formData.status,
                createdAt: editData?.createdAt || new Date()
            };

            if (editData) {
                // Update existing EMI
                const emiRef = doc(db, "emis", editData.id);
                await updateDoc(emiRef, emiData);
                console.log("EMI updated successfully!");
            } else {
                // Add new EMI
                const docRef = await addDoc(recordsCollectionRef, emiData);
                console.log("EMI added with ID: ", docRef.id);
            }
            
            setSaveLoading(false);
            hideModal();
            getEmis(); // Refresh the records after adding/updating
        } catch (err) {
            console.error("Error adding/updating EMI: ", err);
            setError("Failed to save EMI. Please try again.");
            setSaveLoading(false);
        }
    };

    const getEmis = async () => {
        try {
            const emiSnapshot = await getDocs(recordsCollectionRef);
            const emisData = emiSnapshot.docs.map((doc) => {
                const data = doc.data();
                return { 
                    id: doc.id, 
                    ...data,
                    // Format createdAt timestamp if it exists
                    createdAt: data.createdAt ? formatTimestamp(data.createdAt) : '',
                    // Use emiAmount if it exists, otherwise use amount
                    emiAmount: data.emiAmount || data.amount || 0
                };
            });
            setRecords(emisData);
            console.log("EMIs data loaded: ", emisData);
        } catch (error) {
            console.error("Error fetching EMIs:", error);
        }
    };

    return (
        <div className='p-4 mx-4'>
            {/* EMI form modal */}
            <Dialog open={showModal} onClose={hideModal} maxWidth="md" fullWidth>
                <DialogTitle>{editData ? 'Edit EMI' : 'Add New EMI'}</DialogTitle>
                <form onSubmit={handleSubmit}>
                    <DialogContent>
                        <Box sx={{ mt: 2 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth required>
                                        <InputLabel id="email-label">Email</InputLabel>
                                        <Select
                                            labelId="email-label"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            label="Email"
                                        >
                                            {loanEmails.map((loan, index) => (
                                                <MenuItem key={index} value={loan.email}>
                                                    {loan.email}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        required
                                        label="EMI Amount"
                                        name="emiAmount"
                                        type="number"
                                        value={formData.emiAmount}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        required
                                        label="Loan Amount"
                                        name="loanAmount"
                                        type="number"
                                        value={formData.loanAmount}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        required
                                        label="Remaining Loan Amount"
                                        name="remainingLoanAmount"
                                        type="number"
                                        value={formData.remainingLoanAmount}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        required
                                        label="Total Payment"
                                        name="totalPayment"
                                        type="number"
                                        value={formData.totalPayment}
                                        onChange={handleChange}
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Total EMI Paid"
                                        name="totalEMIPaid"
                                        type="number"
                                        value={formData.totalEMIPaid}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        required
                                        label="Interest Rate (%)"
                                        name="interestRate"
                                        type="number"
                                        inputProps={{ step: "0.01" }}
                                        value={formData.interestRate}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        required
                                        label="Loan Term (Months)"
                                        name="loanTerm"
                                        type="number"
                                        value={formData.loanTerm}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        required
                                        label="Start Date"
                                        name="startDate"
                                        type="date"
                                        value={formData.startDate}
                                        onChange={handleChange}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </Grid>
                                
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        required
                                        label="End Date"
                                        name="endDate"
                                        type="date"
                                        value={formData.endDate}
                                        onChange={handleChange}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </Grid>
                                
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth>
                                        <InputLabel id="status-label">Status</InputLabel>
                                        <Select
                                            labelId="status-label"
                                            name="status"
                                            value={formData.status}
                                            onChange={handleChange}
                                            label="Status"
                                        >
                                            <MenuItem value="Pending">Pending</MenuItem>
                                            <MenuItem value="Paid">Paid</MenuItem>
                                            <MenuItem value="Overdue">Overdue</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>

                            {error && (
                                <Box sx={{ color: 'error.main', mt: 2 }}>
                                    {error}
                                </Box>
                            )}
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={hideModal}>Cancel</Button>
                        <Button 
                            type="submit" 
                            variant="contained" 
                            color="primary"
                            disabled={saveLoading}
                        >
                            {saveLoading ? 'Saving...' : 'Save'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            <h1 className='mt-5 text-2xl text-blue-600'>All EMIs</h1>
            <div className="flex-grow flex justify-center">
                <div className='mt-10'>
                    <div className='my-3 flex justify-end mr-4'>
                        <Button 
                            variant="outlined" 
                            size="small" 
                            onClick={() => {
                                setEditData(null);
                                setFormData({
                                    email: '',
                                    emiAmount: '',
                                    remainingLoanAmount: '',
                                    totalPayment: '',
                                    totalEMIPaid: '',
                                    loanAmount: '',
                                    interestRate: '',
                                    loanTerm: '',
                                    startDate: '',
                                    endDate: '',
                                    paid: false,
                                    status: 'Pending'
                                });
                                setShowModal(true);
                            }}
                        >
                            Add EMI
                        </Button>
                    </div>
                    {!loading && (
                        <DataGridTable data={records} columns={recordColumns} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Emi;