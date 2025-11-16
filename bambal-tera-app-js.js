const { useState, useEffect } = React;
const { Sparkles, Gift, Percent, QrCode, ScanLine, Users, Settings, LogOut, Plus, Minus, Trash2 } = lucide;

function LaundryApp() {
    const [view, setView] = useState('login');
    const [currentUser, setCurrentUser] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [adminPassword, setAdminPassword] = useState('');
    const [customers, setCustomers] = useState({});
    const [showQR, setShowQR] = useState(false);
    const [scanInput, setScanInput] = useState('');
    const [showReward, setShowReward] = useState({ show: false, type: '' });

    useEffect(() => {
        const stored = localStorage.getItem('bambal-customers');
        if (stored) {
            try {
                setCustomers(JSON.parse(stored));
            } catch (e) {
                console.error('Parse error:', e);
            }
        }
    }, []);

    const saveData = (data) => {
        localStorage.setItem('bambal-customers', JSON.stringify(data));
        setCustomers(data);
    };

    const handleLogin = () => {
        const phone = phoneNumber.replace(/\D/g, '');
        if (!phone || phone.length < 10) {
            alert('Enter valid phone (10+ digits)');
            return;
        }

        const stored = localStorage.getItem('bambal-customers');
        const all = stored ? JSON.parse(stored) : {};

        if (!all[phone]) {
            if (!customerName.trim()) {
                alert('Enter your name for registration');
                return;
            }
            all[phone] = {
                name: customerName,
                phone,
                stamps: 0,
                totalDiscounts: 0,
                totalFree: 0
            };
            saveData(all);
        }

        setCustomers(all);
        setCurrentUser(phone);
        setView('customer');
    };

    const addStamp = (phone) => {
        const c = customers[phone];
        if (c && c.stamps < 10) {
            const newStamps = c.stamps + 1;
            saveData({
                ...customers,
                [phone]: { ...c, stamps: newStamps }
            });
            if (newStamps === 5 || newStamps === 10) {
                setShowReward({ show: true, type: newStamps === 10 ? 'free' : 'discount' });
                setTimeout(() => setShowReward({ show: false, type: '' }), 2000);
            }
        }
    };

    const removeStamp = (phone) => {
        const c = customers[phone];
        if (c && c.stamps > 0) {
            saveData({
                ...customers,
                [phone]: { ...c, stamps: c.stamps - 1 }
            });
        }
    };

    const claimReward = (phone, type) => {
        const c = customers[phone];
        saveData({
            ...customers,
            [phone]: {
                ...c,
                stamps: 0,
                totalDiscounts: type === 'discount' ? c.totalDiscounts + 1 : c.totalDiscounts,
                totalFree: type === 'free' ? c.totalFree + 1 : c.totalFree
            }
        });
        setShowReward({ show: false, type: '' });
    };

    const deleteCustomer = (phone) => {
        if (confirm('Delete customer?')) {
            const updated = { ...customers };
            delete updated[phone];
            saveData(updated);
        }
    };

    // LOGIN
    if (view === 'login') {
        return React.createElement('div', { className: 'min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 p-6 flex items-center justify-center' },
            React.createElement('div', { className: 'max-w-md w-full space-y-4' },
                React.createElement('div', { className: 'bg-white rounded-3xl shadow-2xl p-8' },
                    React.createElement('div', { className: 'text-center mb-8' },
                        React.createElement('div', { className: 'inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full mb-4 shadow-lg' },
                            React.createElement('svg', { className: 'w-10 h-10 text-white', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
                                React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2, d: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' })
                            )
                        ),
                        React.createElement('h1', { className: 'text-3xl font-bold text-gray-800 mb-2' }, 'Bambal Tera'),
                        React.createElement('h2', { className: 'text-xl font-semibold text-gray-700 mb-1' }, 'Laundry Shop'),
                        React.createElement('p', { className: 'text-gray-600' }, 'Customer Login')
                    ),
                    React.createElement('div', { className: 'space-y-4' },
                        React.createElement('div', null,
                            React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-2' }, 'Phone Number'),
                            React.createElement('input', {
                                type: 'tel',
                                value: phoneNumber,
                                onChange: (e) => setPhoneNumber(e.target.value),
                                placeholder: '09171234567',
                                className: 'w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none'
                            })
                        ),
                        React.createElement('div', null,
                            React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-2' }, 'Name (First time)'),
                            React.createElement('input', {
                                type: 'text',
                                value: customerName,
                                onChange: (e) => setCustomerName(e.target.value),
                                placeholder: 'Your name',
                                className: 'w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none'
                            })
                        ),
                        React.createElement('button', {
                            onClick: handleLogin,
                            className: 'w-full bg-gradient-to-r from-blue-500 to-cyan-600 text-white py-4 rounded-xl font-semibold shadow-lg'
                        }, 'Login / Register')
                    )
                ),
                React.createElement('button', {
                    onClick: () => setView('admin-login'),
                    className: 'w-full bg-gray-800 text-white py-3 rounded-xl font-medium'
                }, 'Admin Login')
            )
        );
    }

    // ADMIN LOGIN
    if (view === 'admin-login') {
        return React.createElement('div', { className: 'min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black p-6 flex items-center justify-center' },
            React.createElement('div', { className: 'max-w-md w-full' },
                React.createElement('div', { className: 'bg-white rounded-3xl shadow-2xl p-8' },
                    React.createElement('div', { className: 'text-center mb-8' },
                        React.createElement('div', { className: 'inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full mb-4' },
                            React.createElement(Settings, { size: 40, className: 'text-white' })
                        ),
                        React.createElement('h1', { className: 'text-3xl font-bold text-gray-800 mb-2' }, 'Admin Access'),
                        React.createElement('p', { className: 'text-gray-600' }, 'Enter password')
                    ),
                    React.createElement('div', { className: 'space-y-4' },
                        React.createElement('input', {
                            type: 'password',
                            value: adminPassword,
                            onChange: (e) => setAdminPassword(e.target.value),
                            placeholder: 'Password',
                            className: 'w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none',
                            onKeyPress: (e) => e.key === 'Enter' && adminPassword === 'admin123' && setView('admin')
                        }),
                        React.createElement('button', {
                            onClick: () => adminPassword === 'admin123' ? setView('admin') : alert('Wrong password'),
                            className: 'w-full bg-gradient-to-r from-gray-700 to-gray-900 text-white py-4 rounded-xl font-semibold'
                        }, 'Login'),
                        React.createElement('button', {
                            onClick: () => setView('login'),
                            className: 'w-full bg-gray-100 text-gray-700 py-3 rounded-xl'
                        }, 'Back')
                    ),
                    React.createElement('p', { className: 'text-xs text-gray-500 text-center mt-4' }, 'Default: admin123')
                )
            )
        );
    }

    // CUSTOMER VIEW
    if (view === 'customer' && currentUser && customers[currentUser]) {
        const c = customers[currentUser];
        const status = c.stamps === 10 ? { text: 'Free Load Ready!', color: 'green' } :
                      c.stamps === 5 ? { text: '30% Off Ready!', color: 'blue' } :
                      c.stamps > 5 ? { text: `${10 - c.stamps} more for FREE`, color: 'purple' } :
                      { text: `${5 - c.stamps} more for 30% OFF`, color: 'amber' };

        return React.createElement('div', { className: 'min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 p-6' },
            React.createElement('div', { className: 'max-w-md mx-auto' },
                React.createElement('div', { className: 'flex justify-between items-center mb-6' },
                    React.createElement('div', null,
                        React.createElement('h2', { className: 'text-2xl font-bold text-gray-800' }, c.name),
                        React.createElement('p', { className: 'text-gray-600 text-sm' }, c.phone)
                    ),
                    React.createElement('button', {
                        onClick: () => { setView('login'); setCurrentUser(null); },
                        className: 'bg-white p-3 rounded-xl shadow-md'
                    }, React.createElement(LogOut, { size: 20, className: 'text-gray-600' }))
                ),
                React.createElement('div', { className: 'bg-white rounded-3xl shadow-2xl p-8 mb-6' },
                    React.createElement('div', { className: 'text-center mb-6' },
                        React.createElement('button', {
                            onClick: () => setShowQR(!showQR),
                            className: 'inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold'
                        },
                            React.createElement(QrCode, { size: 20 }),
                            showQR ? 'Hide QR' : 'Show QR'
                        )
                    ),
                    showQR && React.createElement('div', { className: 'bg-white p-6 rounded-2xl border-4 border-blue-500 mb-6' },
                        React.createElement('div', { className: 'bg-gray-900 text-white text-center py-8 rounded-xl font-mono text-2xl font-bold' }, c.phone),
                        React.createElement('p', { className: 'text-center text-sm text-gray-600 mt-3' }, 'Show to staff')
                    ),
                    React.createElement('div', { className: 'grid grid-cols-5 gap-3 mb-6' },
                        [...Array(10)].map((_, i) =>
                            React.createElement('div', {
                                key: i,
                                className: `aspect-square rounded-xl border-2 flex items-center justify-center ${
                                    i < c.stamps
                                        ? i < 5 ? 'bg-gradient-to-br from-blue-400 to-cyan-500 border-cyan-600 shadow-lg'
                                                : 'bg-gradient-to-br from-purple-400 to-pink-500 border-pink-600 shadow-lg'
                                        : 'bg-gray-50 border-gray-300 border-dashed'
                                } ${(i === 4 || i === 9) ? 'ring-2 ring-yellow-400' : ''}`
                            },
                                i < c.stamps && React.createElement(Sparkles, { size: 20, className: 'text-white' })
                            )
                        )
                    ),
                    React.createElement('div', {
                        className: `bg-gradient-to-r ${
                            status.color === 'green' ? 'from-green-500 to-emerald-600' :
                            status.color === 'blue' ? 'from-blue-500 to-cyan-600' :
                            status.color === 'purple' ? 'from-purple-500 to-pink-600' :
                            'from-amber-500 to-orange-600'
                        } text-white rounded-xl p-4 mb-6 text-center`
                    },
                        React.createElement('p', { className: 'font-bold text-lg' }, status.text)
                    ),
                    c.stamps === 10 && React.createElement('button', {
                        onClick: () => claimReward(currentUser, 'free'),
                        className: 'w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-semibold mb-3 flex items-center justify-center gap-2'
                    }, React.createElement(Gift, { size: 20 }), 'Claim FREE Load!'),
                    c.stamps === 5 && React.createElement('button', {
                        onClick: () => claimReward(currentUser, 'discount'),
                        className: 'w-full bg-gradient-to-r from-blue-500 to-cyan-600 text-white py-4 rounded-xl font-semibold mb-3 flex items-center justify-center gap-2'
                    }, React.createElement(Percent, { size: 20 }), 'Claim 30% OFF!')
                )
            ),
            showReward.show && React.createElement('div', { className: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50' },
                React.createElement('div', { className: 'bg-white rounded-3xl p-8 mx-4 text-center animate-bounce' },
                    React.createElement('div', {
                        className: `inline-flex items-center justify-center w-20 h-20 ${
                            showReward.type === 'free' ? 'bg-green-500' : 'bg-blue-500'
                        } rounded-full mb-4`
                    },
                        showReward.type === 'free'
                            ? React.createElement(Gift, { size: 40, className: 'text-white' })
                            : React.createElement(Percent, { size: 40, className: 'text-white' })
                    ),
                    React.createElement('h2', { className: 'text-3xl font-bold mb-2' }, 'Reward Unlocked!'),
                    React.createElement('p', { className: 'text-gray-600' }, showReward.type === 'free' ? 'FREE load!' : '30% OFF!')
                )
            )
        );
    }

    // ADMIN VIEW
    if (view === 'admin') {
        const total = Object.keys(customers).length;
        const stamps = Object.values(customers).reduce((s, c) => s + c.stamps, 0);
        const discounts = Object.values(customers).reduce((s, c) => s + c.totalDiscounts, 0);
        const free = Object.values(customers).reduce((s, c) => s + c.totalFree, 0);

        return React.createElement('div', { className: 'min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black p-6' },
            React.createElement('div', { className: 'max-w-6xl mx-auto' },
                React.createElement('div', { className: 'flex justify-between items-center mb-6' },
                    React.createElement('div', null,
                        React.createElement('h1', { className: 'text-3xl font-bold text-white' }, 'Bambal Tera'),
                        React.createElement('p', { className: 'text-gray-400' }, 'Admin Dashboard')
                    ),
                    React.createElement('button', {
                        onClick: () => { setView('login'); setAdminPassword(''); },
                        className: 'bg-red-500 text-white px-6 py-3 rounded-xl flex items-center gap-2'
                    }, React.createElement(LogOut, { size: 20 }), 'Logout')
                ),
                React.createElement('div', { className: 'grid grid-cols-4 gap-4 mb-6' },
                    React.createElement('div', { className: 'bg-blue-500 rounded-2xl p-6 text-white' },
                        React.createElement(Users, { size: 32, className: 'mb-2' }),
                        React.createElement('p', { className: 'text-3xl font-bold' }, total),
                        React.createElement('p', null, 'Customers')
                    ),
                    React.createElement('div', { className: 'bg-purple-500 rounded-2xl p-6 text-white' },
                        React.createElement(Sparkles, { size: 32, className: 'mb-2' }),
                        React.createElement('p', { className: 'text-3xl font-bold' }, stamps),
                        React.createElement('p', null, 'Active Stamps')
                    ),
                    React.createElement('div', { className: 'bg-cyan-500 rounded-2xl p-6 text-white' },
                        React.createElement(Percent, { size: 32, className: 'mb-2' }),
                        React.createElement('p', { className: 'text-3xl font-bold' }, discounts),
                        React.createElement('p', null, 'Discounts')
                    ),
                    React.createElement('div', { className: 'bg-green-500 rounded-2xl p-6 text-white' },
                        React.createElement(Gift, { size: 32, className: 'mb-2' }),
                        React.createElement('p', { className: 'text-3xl font-bold' }, free),
                        React.createElement('p', null, 'Free Loads')
                    )
                ),
                React.createElement('div', { className: 'bg-white rounded-2xl p-6 mb-6' },
                    React.createElement('h2', { className: 'text-xl font-bold mb-4' }, 'Quick Scan'),
                    React.createElement('div', { className: 'flex gap-3' },
                        React.createElement('input', {
                            type: 'text',
                            value: scanInput,
                            onChange: (e) => setScanInput(e.target.value),
                            placeholder: 'Phone number',
                            className: 'flex-1 px-4 py-3 border-2 rounded-xl'
                        }),
                        React.createElement('button', {
                            onClick: () => {
                                const phone = scanInput.replace(/\D/g, '');
                                if (customers[phone]) {
                                    addStamp(phone);
                                    setScanInput('');
                                    alert('Stamp added!');
                                } else {
                                    alert('Customer not found');
                                }
                            },
                            className: 'bg-blue-500 text-white px-6 py-3 rounded-xl flex items-center gap-2'
                        }, React.createElement(ScanLine, { size: 20 }), 'Add Stamp')
                    )
                ),
                React.createElement('div', { className: 'bg-white rounded-2xl overflow-hidden' },
                    React.createElement('div', { className: 'p-6 border-b' },
                        React.createElement('h2', { className: 'text-xl font-bold' }, 'All Customers')
                    ),
                    Object.keys(customers).length === 0
                        ? React.createElement('div', { className: 'text-center py-12 text-gray-500' },
                            React.createElement(Users, { size: 64, className: 'mx-auto mb-4 opacity-50' }),
                            React.createElement('p', null, 'No customers yet')
                        )
                        : React.createElement('table', { className: 'w-full' },
                            React.createElement('thead', { className: 'bg-gray-50' },
                                React.createElement('tr', null,
                                    React.createElement('th', { className: 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase' }, 'Customer'),
                                    React.createElement('th', { className: 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase' }, 'Phone'),
                                    React.createElement('th', { className: 'px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase' }, 'Stamps'),
                                    React.createElement('th', { className: 'px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase' }, 'Actions')
                                )
                            ),
                            React.createElement('tbody', { className: 'divide-y' },
                                Object.values(customers).map(c =>
                                    React.createElement('tr', { key: c.phone, className: 'hover:bg-gray-50' },
                                        React.createElement('td', { className: 'px-6 py-4' },
                                            React.createElement('div', { className: 'flex items-center gap-3' },
                                                React.createElement('div', { className: 'w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold' },
                                                    c.name.charAt(0)
                                                ),
                                                React.createElement('span', { className: 'font-medium' }, c.name)
                                            )
                                        ),
                                        React.createElement('td', { className: 'px-6 py-4 text-gray-600' }, c.phone),
                                        React.createElement('td', { className: 'px-6 py-4 text-center' },
                                            React.createElement('span', { className: 'bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold' }, c.stamps)
                                        ),
                                        React.createElement('td', { className: 'px-6 py-4' },
                                            React.createElement('div', { className: 'flex items-center justify-center gap-2' },
                                                React.createElement('button', {
                                                    onClick: () => addStamp(c.phone),
                                                    className: 'bg-green-500 text-white p-2 rounded-lg'
                                                }, React.createElement(Plus, { size: 16 })),
                                                React.createElement('button', {
                                                    onClick: () => removeStamp(c.phone),
                                                    className: 'bg-orange-500 text-white p-2 rounded-lg'
                                                }, React.createElement(Minus, { size: 16 })),
                                                React.createElement('button', {
                                                    onClick: () => deleteCustomer(c.phone),
                                                    className: 'bg-red-500 text-white p-2 rounded-lg'
                                                }, React.createElement(Trash2, { size: 16 }))
                                            )
                                        )
                                    )
                                )
                            )
                        )
                )
            )
        );
    }

    return null;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(LaundryApp));