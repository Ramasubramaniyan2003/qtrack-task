class UsersList {

  constructor() {
    this.bindlistners();
    this.datatableinit()
  }

  
  datatableinit() {
    $('#userTable').DataTable({
      serverSide: true,
      processing: true, 
      pageLength: 50, 
      lengthMenu: [50], 
      ajax: {
        url: '/user/get', // API endpoint
        type: "GET",
        dataType: 'json',
        headers: { 'X-AT-SessionToken': localStorage.sessionToken },
        data: function (d) {
          d.limit = 50; 
        },
        fixedColumns: {
          leftColumns: 1, 
          rightColumns: 1 
        },
        dom: 'Bfrtip',
        buttons: ['copy', { extend: 'excel', "title": "Employees" }, { extend: 'pdf', 'title': 'Employee' }],

        dataSrc: "data"
      },
      columns: [
        { data: "id" },
        { data: "firstName" },
        { data: "lastName" },
        { data: "fullName" },
        { data: "phoneNo" },
        { data: "email" },
        { data: "nationalId" },
        {
          data: 'addresses',
          render: (data) => data && data[0] && data[0].addressType || ''
        },
        {
          data: "addresses",
          render: (data) => {
            let address = data && data[0] && `${data[0].addressLine1} ${data[0].addressLine2} ${data[0].addressLine3}`;
            return address || '';
          }
        },
        {
          data: "addresses",
          render: (data) => {
            let address = data && data[0] && `${data[0].city}, ${data[0].state}-${data[0].pincode}`;
            return address || '';
          }
        },
        {
          data: "createdAt",
          render: (data) => moment(data).format('DD-MM-YYYY hh:mm A')
        },
        {
          data: '',
          render: function (data, type, full) {
            let buttons = '';
            buttons += `<a data-id="${full.id}" class="update btn btn-primary btn-sm" style="margin-bottom: 3px;">Update</a> &nbsp`;
            buttons += `<a data-id="${full.id}" class="delete btn btn-danger btn-sm" style="margin-bottom: 3px;">Delete</a>`;
            return buttons;
          }
        }
      ],
      scrollY: "40vh",
      scrollX: true,
      scrollCollapse: true, 
    });
  
  }
  register(e) {
      e.preventDefault();
      $('#registerBtn').prop('disabled', true);
      $.ajax({
          type: 'POST',
          url: '/user/register',
          data: $('#registerForm').serialize(),
          headers: { 'X-AT-SessionToken': localStorage.sessionToken }
      }).done(function (response) {
          if (response.success === true) {
              $('#userTable').DataTable().ajax.reload();
              $('#registerBtn').prop('disabled', false);
              $('#registerModal').modal('hide');
              document.getElementById('registerForm').reset();

          } else {
              ('#registerBtn').prop('disabled', false);
              alert(response.message || response.error  || 'Error saving data');
          };
      });
  }

  getUserData(e) {
    const clickedRow = $(this).closest('tr');
    const user = $('#userTable').DataTable().row(clickedRow).data();
    $('#updateFirstName').val(user.firstName);
    $('#updateLastName').val(user.lastName);
    $('#updatePhoneNo').val(user.phoneNo);
    $('#updateEmail').val(user.email);

    $('#updateAddressType').val(user.addresses[0]?.addressType)

    $('#updateNationalId').val(user.nationalId);
    
    $('#updateAddressLine1').val(user.addresses[0]?.addressLine1 || '');
    $('#updateAddressLine2').val(user.addresses[0]?.addressLine2 || '');
    $('#updateAddressLine3').val(user.addresses[0]?.addressLine3 || '');
    $(`#updateUserForm input[name="isPermanent"][value="${user.isPermanent}"]`).prop('checked', true);
    $('#updateCity').val(user.addresses[0]?.city || '');
    $('#updateState').val(user.addresses[0]?.state || '');
    $('#updatePincode').val(user.addresses[0]?.pincode || '');
    $('#updateId').val(user.id);
    $('#updateUserModal').modal('show');
  }


  updateUser(e) {
    e.preventDefault();  // Prevent the default form submission
    $.ajax({
      type: 'PUT', 
      url: '/user/update',  
      data: $('#updateUserForm').serialize(), 
      headers: { 'X-AT-SessionToken': localStorage.sessionToken },
      success: function(response) {
        if (response.success) {
          // Perform actions on successful update
          $('#updateUserModal').modal('hide');
          $('#userTable').DataTable().ajax.reload();  // Reload the DataTable
        } else {
          alert(response.message|| response.error || 'Error updating user');
        }
      },
      error: function(err) {
        alert(response.message || response.error || 'An error occurred. Please try again.');
      }
    });
  }

  deleteUser() {
    const clickedRow = $(this).closest('tr');
    const user = $('#userTable').DataTable().row(clickedRow).data();
    var answer = window.confirm("are you sure to delete?");
    if (answer) {
    $.ajax({
      type: 'DELETE', 
      url: '/user/delete/'+user.id,  
      headers: { 'X-AT-SessionToken': localStorage.sessionToken },
      success: function(response) {
        console.log(response);
        if (response.success) {
          console.log('true');
          alert('User deleted!');
          $('#userTable').DataTable().ajax.reload();
        } else {
          alert(response.message|| response.error  || 'Error updating user');
        }
      },
      error: function(err) {
        alert(err.error ||'An error occurred. Please try again.');
      }
    });
  }
  }

  bindlistners() {
    $('#registerForm').on('submit', this.register);
    $('#updateUserForm').on('submit', this.updateUser);
    $('#userTable').on('click','.update', this.getUserData);
    $('#userTable').on('click','.delete', this.deleteUser);

  }

}

UsersList = new UsersList();



