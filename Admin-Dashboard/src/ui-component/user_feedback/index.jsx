import { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { TableContainer, Table, TextField, InputAdornment, Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import SearchIcon from '@mui/icons-material/Search';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';

 import { userFeedback } from 'utils/TableConfig';
//  import { getUserFeedback,getUserFeedbackCount } from 'container/UserFeedbackContainer/slice';
import ViewFeedbackDetail from './viewFeedback';
// const users = [
//   { id: 1, name: 'Alice', age: 30, city: 'New York' },
//   { id: 2, name: 'Bob', age: 24, city: 'London' },
//   { id: 3, name: 'Charlie', age: 45, city: 'Paris' },
// ];
import MainCard from 'ui-component/cards/MainCard';
import Pagination from 'utils/TablePagination';
import TableHead from 'utils/TableHead';
import TableRows from 'utils/TableRows';
import styles from '../common/style';

import { Add as AddIcon } from '@mui/icons-material';
import cmnStyles from '../common/style1';

export default function Type() {
  const theme = useTheme();
  const style = styles(theme);
  const cmnstyle = cmnStyles(theme);
  const dispatch = useDispatch();

  const [page, setPage] = useState(0);
      const [limit, setLimit] = useState(20);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState('');
  const [open, setOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showXSLModal, setshowXSLModal] = useState(false);

  const efTypeList = useSelector((state) => state.feedback?.list || []);
  const count = useSelector((state) => state.feedback?.listCount || 0);
  const emissionFactorTypeXSLList = useSelector((state) => state.emission?.emissionFactorTypeXSLList || []);
  let tableDataFilter = emissionFactorTypeXSLList.map((item, index) => ({
    slno: index + 1,
    name: item.name,
    desc: item.desc
  }));
  let countPagination = Math.ceil(count / limit);
  const { config, keys } = userFeedback;

  // useEffect(() => {
  //   dispatch(getUserFeedback());
  //   dispatch(getUserFeedbackCount())
  //   // dispatch(getEfType({ searchVal: searchQuery, page: page + 1 }));
  // }, [searchQuery]);

  const searchHandler = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setPage(0);
  };

  function handleDownloadExcel() {
    setshowXSLModal(true);
    // dispatch(fetchEmissionFactorTypeXSL({ limit: count }));
  }

  const XSLHandler = () => {
    excelExport();
    closeXSLModal();
  };
  const header = ['SL.NO', 'Name', 'Description'];
  function excelExport() {
    downloadExcel({
      fileName: 'Emission Factor Type',
      sheet: 'Emission Factor Type',
      tablePayload: {
        header,
        body: tableDataFilter
      }
    });
  }

  const closeXSLModal = () => {
    setshowXSLModal(false);
  };

  const handleViewModal = (item) => {
    setOpen(true);
    setSelectedItem(item);
  };

  const handleFormModal = (item) => {
    setFormOpen(true);
    setSelectedItem(item);
  };

  const handleAddFormModal = (item) => {
    setFormOpen(true);
    setSelectedItem({});
  };

  const handlePageClick = (e) => {
    const selectedPage = e.selected;
    setPage(selectedPage);
    // dispatch(
    //   getEfType({
    //     page: selectedPage + 1,
    //     searchVal: searchQuery
    //   })
    // );
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const handleDeleteModal = (item) => {
    setShowDeleteModal(true);
    setSelectedItem(item);
  };

  const deleteHandler = () => {
    // dispatch(deleteEfType(selectedItem));
    setPage(0);
    closeDeleteModal();
  };

  return (
    <>
      <MainCard>
        <Grid container direction={'row'} justifyContent={'space-between'} alignItems={'center'} spacing={1}>
          <Typography variant="h2" component="h5" sx={{ color: theme.palette.primary.dark, fontWeight: 500 }}>
            Feedback
          </Typography>
        </Grid>
        <Grid container spacing={2} sx={{ width: '100%', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Left Button */}
          {/* <Grid item xs={12} sm={4} md={3} lg={3} xl={3}>
            <Box sx={{ display: 'flex', justifyContent: { xs: 'center', sm: 'flex-start' }, alignItems: 'center' }}>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                sx={{ ...cmnstyle.cmnBtn, ...cmnstyle.cmnBtnOutline, px: 3 }}
                onClick={handleAddFormModal}
              >
                Add
              </Button>
            </Box>
          </Grid> */}

          {/* Search Box */}
          <Grid item xs={12} sm={4} md={6} lg={6} xl={6}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', pt: { xs: 1, md: 2 }  }}>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                placeholder="Search by name"
                sx={{ maxWidth: 300, width: '100%' }}
                value={searchQuery}
                onChange={searchHandler}
                onKeyDown={(e) => {
                  if (!regex.test(e.key) && e.key !== 'Backspace') {
                    e.preventDefault();
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  sx: style.searchBox
                }}
              />
            </Box>
          </Grid>

          {/* Export Button */}
          <Grid item xs={12} sm={4} md={3} lg={3} xl={3}>
            <Box sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-end' }, alignItems: 'center' }}>
              <Button
                variant="outlined"
                onClick={handleDownloadExcel}
                startIcon={<FileDownloadOutlinedIcon />}
                sx={{
                  color: '#242121',
                  backgroundColor: 'white',
                  borderColor: '#3dcd58',
                  width: '180px',
                  py: 1,
                  borderRadius: '30px',
                  whiteSpace: 'nowrap', // 🚀 keeps text in one line
                  textOverflow: 'ellipsis', // optional, trims if overflowing
                  overflow: 'hidden', // optional, prevents bulge
                  '&:hover': {
                    color: '#fcf9f9 !important',
                    backgroundColor: '#3dcd58',
                    borderColor: '#3dcd58'
                  },
                  '&:active': {
                    color: '#fcf9f9 !important',
                    backgroundColor: '#3dcd58',
                    borderColor: '#3dcd58'
                  }
                }}
              >
                Export to Excel
              </Button>
            </Box>
          </Grid>
        </Grid>

        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="project table">
            <TableHead keys={keys} config={config} />
            <TableRows
              data={efTypeList}
              keys={keys}
              config={config}
              currentPage={page + 1}
              tableLimit={limit} 
              hasView={true}
              hasEdit={false}
              hasComment={false}
              hasDelete={false}
              hasStatusChange={false}
              hasMore={false}
              handleViewModel={handleViewModal}
              handleDeleteModal={handleDeleteModal}
              handleFormModal={handleFormModal}
              msg="Projects"
              tableData={efTypeList}
              filter={searchQuery || ''}
            />
          </Table>
        </TableContainer>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, mb: 4 }}>
          {countPagination > 0 && <Pagination page={page} countPagination={countPagination} handlePageClick={handlePageClick} />}
        </Box>
        {open && <ViewFeedbackDetail drawerOpen={open} setDrawerOpen={setOpen} item={selectedItem} setPage={setPage}/>}
        {/* {formOpen && <UpdateEfTypeForm drawerOpen={formOpen} setDrawerOpen={setFormOpen} item={selectedItem} setPage={setPage} />} */}
        {showDeleteModal && (
          <ConfirmModal
            show={showDeleteModal}
            handleCloseModal={closeDeleteModal}
            submitHandler={deleteHandler}
            modalTitle={'Delete Confirmation'}
            modalText={'Are you sure you want to delete?'}
            btnsubmitText={'DELETE'}
          />
        )}
        {/* {showXSLModal && (
          <ConfirmModal
            show={showXSLModal}
            handleCloseModal={closeXSLModal}
            submitHandler={XSLHandler}
            modalTitle={'Download Confirmation'}
            modalText={'Are you sure you want to download?'}
            btnsubmitText={'DOWNLOAD'}
          />
        )} */}
      </MainCard>
    </>
  );
}