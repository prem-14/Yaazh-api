const yup = require('yup')

// Hidden for simplicity

exports.getCustomer = yup.object({
  query: yup.object({
    id: yup.string().required(),
  }),
})

exports.deleteCustomer = yup.object({
  body: yup.object({
    id: yup.string().required(),
  }),
})

exports.updateCustomer = yup.object({
  body: yup.object({
    id: yup.string().required(),
  }),
})

exports.changeCustomerStatus = yup.object({
  body: yup.object({
    id: yup.array().min(1, 'Minimum of 1 value is required').required(),
    status: yup.string().required(),
  }),
})
