import React from 'react';
import { CardNumberElement, CardExpiryElement, useStripe, useElements } from '@stripe/react-stripe-js';
import './StripePaymentFormVendedor.css';
import { Box, Button, TextField, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StripePaymentFormVendedor = ({handleChangeAgregar, idUsuario}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [cvc, setCVC] = React.useState();
  const handleInputChange = (event) => {
    const value = event.target.value;
    const regex = /^[0-9\b]+$/;
    
    if (value === '' || regex.test(value)) {
        setCVC(value);
    }
};
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardNumberElement),
    });

    if (error) {
        toast.error('Se produjo un error, verifique los datos.');
        return;
    }
    
    const { last4, exp_month, exp_year } = paymentMethod.card;
    const token = paymentMethod.id;
    const expirationDate = exp_month + '/' + exp_year;

    const formData = new FormData();
    formData.append('Last4', last4);
    formData.append('FechaExpiracion', expirationDate);
    formData.append('Token', token);
    formData.append('CVC', cvc);
    formData.append('idUsuario', idUsuario);

    const response = await fetch(
        `https://localhost:7240/GuardarMetodoPago`,
        {
            method: "POST",
            body: formData
        }
    );

    if (response.ok) {
        toast.success("Metodo de pago incorporado", { autoClose: 2000 });
        handleChangeAgregar();
    } else if (response.status === 404) {
        throw new Error("Pedido no encontrado");
    } else {
        throw new Error("Error al crear el pedido");
    }

  };

  return (
    <form className="payment-form" onSubmit={handleSubmit}>
      <div className="form-row" style={{width:"95%", marginBottom:"20px"}}>
        <div>
          <Box sx={{marginBottom:"10px", display:"flex", flexDirection:"row", alignItems:"center"}}>
            <img src='https://cdn-icons-png.flaticon.com/512/423/423519.png' alt='' style={{height:"40px"}}/>
            <Typography sx={{fontSize:"20px", marginLeft:"10px"}}>
                Número de Tarjeta
            </Typography>
          </Box>
          <CardNumberElement className="card-input-element" />
        </div>
      </div>
      <div className="form-row" style={{width:"95%", marginBottom:"10px"}}>
        <div style={{marginBottom:"20px"}}>
            <Box sx={{marginBottom:"10px", display:"flex", flexDirection:"row", alignItems:"center"}}>
                <img src='https://i.pinimg.com/originals/0a/01/d4/0a01d47ef231cdbc18c04192f2c839ee.png' alt='' style={{height:"35px"}}/>
                <Typography sx={{fontSize:"20px", marginLeft:"10px"}}>Fecha de Expiración</Typography>
            </Box>
            <CardExpiryElement className="card-input-element" />
        </div>
        <div style={{marginBottom:"0px"}}>
            <Box sx={{marginBottom:"18px", display:"flex", flexDirection:"row", alignItems:"center"}}>
                <img src='https://cdn-icons-png.flaticon.com/512/747/747305.png' alt='' style={{height:"35px"}}/>
                <Typography sx={{fontSize:"20px", marginLeft:"10px"}}>CVC</Typography>
            </Box>
            <TextField
                variant="outlined"
                sx={{ 
                    height: 34, 
                    width: "101.5%", 
                    '& .MuiInputBase-root': { 
                        height: '100%', 
                        fontSize: '14px'
                    },
                    '& .MuiInputLabel-root': {
                        display: cvc ? 'none' : 'block',
                        marginTop:"-10px"
                    }
                }} 
                value={cvc}
                onChange={handleInputChange}
                label="CVC"
                InputLabelProps={{ shrink: false }}
                inputProps={{ maxLength: 3 }}
            />
        </div>
      </div>
      <Button variant="contained" sx={{width:"96.4%", marginTop:"10px", backgroundColor:"#286C23", '&:hover':{backgroundColor:"#286C23"}}} type="submit" disabled={!stripe}>
        Agregar Método de pago
      </Button>
    </form>
  );
};

export default StripePaymentFormVendedor;