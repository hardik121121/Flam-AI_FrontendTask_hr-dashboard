export const departments = [
  'Engineering',
  'Sales',
  'Marketing',
  'HR',
  'Finance',
  'Operations',
  'Customer Support',
  'Product',
  'Design',
  'Legal'
]

export function getRandomDepartment() {
  return departments[Math.floor(Math.random() * departments.length)]
}

export function getRandomRating() {
  return Math.random() * 4 + 1
}

export function getPerformanceColor(rating) {
  if (rating >= 4.5) return 'success'
  if (rating >= 3.5) return 'info'
  if (rating >= 2.5) return 'warning'
  return 'danger'
}

export function generateMockProjects() {
  const projects = [
    'Website Redesign',
    'Mobile App Development',
    'Customer Portal',
    'Data Analytics Dashboard',
    'Marketing Campaign',
    'Sales Automation',
    'Employee Training Program',
    'Security Audit',
    'API Integration',
    'Cloud Migration'
  ]
  
  const count = Math.floor(Math.random() * 4) + 2
  const selected = []
  
  for (let i = 0; i < count; i++) {
    const project = projects[Math.floor(Math.random() * projects.length)]
    if (!selected.includes(project)) {
      selected.push({
        name: project,
        status: Math.random() > 0.5 ? 'Completed' : 'In Progress',
        contribution: Math.floor(Math.random() * 50) + 50
      })
    }
  }
  
  return selected
}

export function generatePerformanceHistory() {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const currentMonth = new Date().getMonth()
  const history = []
  
  for (let i = 5; i >= 0; i--) {
    const monthIndex = (currentMonth - i + 12) % 12
    history.push({
      month: months[monthIndex],
      rating: Math.random() * 2 + 3
    })
  }
  
  return history
}