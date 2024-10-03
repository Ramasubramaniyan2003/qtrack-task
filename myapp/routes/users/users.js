var models = require('../../models/index');
const { Op } = require('sequelize');



exports.getUsers = async function (req, res) {
    try {

        let { start, length } = req.query;

        start = parseInt(start) || 0; // Starting index
        length = parseInt(length) || 50; // Page length, should be limited to 50

            const users = await models.User.findAndCountAll({
                include: [{ model: models.Address, as: 'addresses' }],
                limit: length,
                offset: start,
                order: [['createdAt', 'DESC']] // Optional: sort by createdAt
            });

            res.send({
                success: true, 
                draw: req.query.draw,
                recordsTotal: users.count,
                recordsFiltered: users.count,
                data: users.rows
            });

        } catch (e) {
            if (e.name === 'SequelizeValidationError') {
                return res.status(400).json({ message: e.errors.map(e => e.message) });
              }
            console.log('error', e);
            console.log('/api/transaction/getTransaction')
            res.send({ success: false, error: "Internal server error " + e });
        }

    }


exports.userRegister = async function (req, res) {
    try {
        const { firstName, lastName, phoneNo, email, nationalId, addressType, addressLine1, addressLine2, addressLine3, city, state, pincode, isPermanent } = req.body

        if (!firstName && !lastName) {
            return res.send({ success: false, message: 'FirstName or LastName should be required' })
        }

        if (!phoneNo) {
            return res.send({ success: false, message: 'PhoneNo should be required' })
        }

        if (!email) {
            return res.send({ success: false, message: 'Email should be required' })
        }

        if (!nationalId) {
            return res.send({ success: false, message: 'NationalId should be required' })
        }

        if (!addressType) {
            return res.send({ success: false, message: 'AddressType should be required' })
        }

        if (!addressLine1) {
            return res.send({ success: false, message: 'Address should be required' })
        }

        if (!state) {
            return res.send({ success: false, message: 'State should be required' })
        }

        if (!pincode) {
            return res.send({ success: false, message: 'Pincode should be required' })
        }

        const User = await models.User.findOne({
            where: {
                [Op.or]: [  // Use Op.or instead of $or
                    { email: email },
                    { phoneNo: phoneNo },
                ],

            }
        });

        if (User) {
            return res.send({ success: false, message: 'User already Existed!' })
        }

        const Users = await models.User.create({
            firstName,
            lastName,
            fullName: firstName + " " + lastName,
            phoneNo,
            email,
            nationalId,
        });
        if (Users) {
            const Addresses = await models.Address.create({
                addressType,
                addressLine1,
                addressLine2,
                addressLine3,
                city,
                state,
                pincode,
                isPermanent,
                userId: Users.id
            })
        }

        res.send({
            success: true,
            message: 'Employee created successfully!',
        });
    } catch (e) {
        if (e.name === 'SequelizeValidationError') {
            return res.status(400).json({ success: false, error: e.errors.map(e => e.message) });
          }
        console.log(e);
        console.log('/api/users/getUser');
        res.send({ success: false, error: "Internal server error " + e });

    }
}

exports.updateUser = async function (req, res) {
    try{
        const { id, firstName, lastName, phoneNo, email, nationalId, addressType, addressLine1, addressLine2, addressLine3, city, state, pincode, isPermanent } = req.body
        if (!firstName && !lastName) {
            return res.send({ success: false, message: 'FirstName or LastName should be required' })
        }

        if (!phoneNo) {
            return res.send({ success: false, message: 'PhoneNo should be required' })
        }

        if (!email) {
            return res.send({ success: false, message: 'Email should be required' })
        }

        if (!nationalId) {
            return res.send({ success: false, message: 'NationalId should be required' })
        }

        if (!addressType) {
            return res.send({ success: false, message: 'AddressType should be required' })
        }

        if (!addressLine1) {
            return res.send({ success: false, message: 'Address should be required' })
        }

        if (!state) {
            return res.send({ success: false, message: 'State should be required' })
        }

        if (!pincode) {
            return res.send({ success: false, message: 'Pincode should be required' })
        }

        const User = await models.User.findOne({
            where: {
                [Op.and]: [
                    {
                        [Op.or]: [
                            { email: email },
                            { phoneNo: phoneNo },
                        ]
                    },
                    {
                        id: {
                            [Op.ne]: id
                        }
                    }
                ]
            }
        });

        if (User) {
            return res.send({ success: false, message: 'User already Existed!' })
        }

        const Users = await models.User.update({
            firstName,
            lastName,
            fullName: firstName + " " + lastName,
            phoneNo,
            email,
            nationalId,
        },{
            where: {
                id: id
            }
        }
    );
        if (Users) {
            const Addresses = await models.Address.update({
                addressType,
                addressLine1,
                addressLine2,
                addressLine3,
                city,
                state,
                pincode,
                isPermanent,
                userId: Users.id
            },
            {
                where: {
                    userId: id
                }
            })
        }
        res.send({ success: true, message: "Updated"});
    }   
    catch (e) {
        if (e.name === 'SequelizeValidationError') {
            return res.status(400).json({ message: e.errors.map(e => e.message) });
          }
        console.log(e);
        console.log('/api/users/updateUser');
        res.send({ success: false, error: "Internal server error " + e });
    }
}

exports.userDelete = async function (req, res) {
    const { id } = req.params;

    try {
        const deletedUser = await models.User.destroy({
            where: {
                id: id
            }
        });

        if (deletedUser) {
            return res.send({ success: true, message:"User Deleted"}); 
        } else {
            return res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        console.log('/api/users/updateDelete');
        res.send({ success: false, error: "Internal server error " + e });    }
}