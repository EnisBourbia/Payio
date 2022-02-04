import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/images/logo.png'
import './index.css'
import { useState, useRef, useEffect } from 'react';
import { Api } from '../Api'
import {Accordion, AccordionSummary, AccordionDetails, Typography, Box, CircularProgress, Badge, styled, Button} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import GavelIcon from '@mui/icons-material/Gavel';
import { useSelector, useDispatch } from 'react-redux'
import { setTodo } from '../redux/Todo';

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -15,
    top: 12,
    border: `0px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}));


function Todo() {
  const dispatch = useDispatch();
  const { todo } = useSelector((state) => state.todo)

  useEffect(() => { 
    Api.get('bookkeep/todo/')
    .then(response => {
      dispatch(setTodo(response.data))
          });
  },[])
  
if (todo.needs_approval === undefined) {
  return (
    <>
    <Box className="center-loading-icon">
      <CircularProgress color="inherit" />
    </Box>
    </>
  );
} else {

return (
    <>
<div className="main-window">
<div className="content-container">
  <h2>Saker att göra</h2>

  <Box className="accordion-todo">
  <Accordion className="accordion">
        <AccordionSummary        
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <StyledBadge badgeContent={todo.needs_approval.length} color="primary">
            <Typography>Godkänn</Typography>
          </StyledBadge>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
           { todo.needs_approval.map((row) => {
            return (
              <div className="todo-row">
                <span className="todo-icon">
                  <GavelIcon/>
                </span>
                <span className="todo-type">
                {row.event_type}
                </span>
                <span className="todo-date">
                {row.event_date}
                </span>
                <span className="todo-button">
                <Button variant="contained">Granska</Button>
                </span>
              </div>
              )
            })
           }
          </Typography>
        </AccordionDetails>
      </Accordion>

     <Accordion className="accordion">
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography>Bokför banktransaktioner</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget.
          </Typography>
        </AccordionDetails>
      </Accordion>

     <Accordion className="accordion">
        <AccordionSummary
          expandIcon={<>{}<ExpandMoreIcon /></>}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography>Bokför uppladdade underlag</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget.
          </Typography>
        </AccordionDetails>
      </Accordion>

     <Accordion className="accordion">
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography>Att få betalt för</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget.
          </Typography>
        </AccordionDetails>
      </Accordion>

     <Accordion className="accordion">
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography>Saker att betala</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget.
          </Typography>
        </AccordionDetails>
      </Accordion>
      </Box>
</div>
</div>
  </>
  );
}
}

export default Todo;
