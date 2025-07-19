// src/services/orderService.js
let orders = [
    {
      id: 1,
      customer: 'Alfreds',
      employee: 'John Doe',
      shipper: 'Speedy Express',
      shipCity: 'Berlin',
      orderDate: '2025-04-24',
      shippedDate: '2025-05-01',
      freight: 32,
      items: [
        { id: 1, product: 'Chai', quantity: 10, price: 18 },
        { id: 2, product: 'Chang', quantity: 5, price: 19 }
      ]
    }
  ]
  
  export default {
    getOrders() {
      return Promise.resolve([...orders])
    },
    saveOrder(order) {
      if (order.id) {
        orders = orders.map(o => (o.id === order.id ? order : o))
      } else {
        order.id = Date.now()
        orders.push(order)
      }
      return Promise.resolve()
    },
    deleteOrder(orderId) {
      orders = orders.filter(o => o.id !== orderId)
      return Promise.resolve()
    },
    getDropdownData() {
      return Promise.resolve({
        customers: ['Alfreds', 'Bon App', 'Around the Horn'],
        employees: ['John Doe', 'Jane Smith', 'Alice Johnson'],
        shippers: ['Speedy Express', 'United Package', 'Federal Shipping'],
        products: ['Chai', 'Chang', 'Aniseed Syrup', 'Chef Anton\'s Gumbo Mix']
      })
    }
  }
  