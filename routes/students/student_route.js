const express = require( 'express' );
const router = express.Router();
const db = require( '../../database' );

// Student List Page
router.get( '/', async (req, res) => {
  try {
    const [result] = await db.query('SELECT * FROM users');
    const students = result;

    res.render( 'students/students_view', {
      title: 'Student Management',
      content: 'View all student list',
      students
    });
  } catch ( err ) {
    console.error( err );
  }
});

// Render Form Page
function renderFormPage( res, error = null, student = null) {
    const isUpdate = !!student;
    res.render( 'students/student_form', {
        title: 'Student Management',
        content: isUpdate ? 'Update Student' : 'Add New Student',
        error,
        student,
        formAction: isUpdate ? `/students/update/${student.id}?_method=POST` : '/students/add'
    });
}

router.get('/update/:id', async (req,res)=>{
    try{
        const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [req.params.id]);
        if(rows.length == 0) return res.status(404).send('Student not found');
        const student = rows[0];
        renderFormPage(res, null, student);
    } catch(err){
        console.error(err)
        res.status(500).send('DB query failed, please check your DB');
    }
});

//TODO: check lecturer git, this is so that there will be no redundancy
function runValidation (res, name, student_no, email, Phone){
    if(!name || name.trim() === '') return renderFormPage(res, 'Name cannot be empty', );
    //student number must be a number

    if(!student_no || !/^\d+$/.test(student_no)) {
        return renderFormPage(res, 'Student no is required and must be in number format');
    }
    if(!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return renderFormPage(res, 'Email no is required and must be in email format');
    }
    if(!/^\d+$/.test(Phone)) {
        return renderFormPage(res, 'Phone must be in number format');
    }
}

//TODO: Fix Update when you are back at home
//Update Student information
router.post('/update/:id', async (req, res) => {
  const { name, student_no, email, Phone } = req.body;
    runValidation(res, name, student_no, email, Phone);
    try{
        const [result] = await db.query(
            'UPDATE users SET name = ?, student_no = ?, email = ?, Phone = ? WHERE id = ?',
            [name, student_no, email, Phone, req.params.id]
        );
        if(result.affectedRows === 0) return res.status(404).send('Student not found');
        res.redirect('/students');
    } catch(err){
        console.error(err);
        renderFormPage(res, 'Database error. Failed to update Students. Please check DB');
    }
});


// Add Student Form
router.get( '/add', (req, res) => renderFormPage( res ));

// Handle Add Student
router.post( '/add', async (req, res) => {
    const { name, student_no, email, Phone } = req.body;
    
    runValidation(res, name, student_no, email, Phone);

    try{
        await db.query('INSERT INTO users(name, student_no, email, Phone, type) VALUES(?,?,?,?,?)', 
            [name, student_no, email, Phone, 'student']);
        res.redirect('/students');
    }catch(err){
        console.error(err);
        renderFormPage(res, 'DATABASE ERROR. PLEASE CHECK AT THE DB LOG.');
    }
});

module.exports = router;