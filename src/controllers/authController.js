const {supabase} = require('../config/supabaseClient');

exports.signup = async (req, res) => {
    const {email, password} = req.body;

    const {data,error} = await supabase.auth.signUp({
        email : email,
        password : password,
    });

    if (error) return res.status(400).json({ error: error.message });

    res.status(201).json(data);
};

exports.signInWithPass = async (req, res) => {
    const {email, password} = req.body;

    const {data,error} = await supabase.auth.signInWithPassword({
        email : email,
        password : password,
    });

    if (error) 
    {
        if(error.message === "Invalid login credentials"){
            return res.status(401).json({ error: error.message });
        }
        return res.status(400).json({ error: error.message });
    }

    res.status(201).json(data);
};

exports.publicInfo = async (req, res) => {
    res.status(200).json({"message" : "Welcome stranger! This info is public."});
};

exports.logout = async (req, res) => {
    res.status(204).json({"message":"Logged out successfully"});
};

exports.protectedInfo = async (req, res) => {
    res.status(200).send("hello");
};

exports.protectedProfile = async (req, res) => {
    const user = req.user;

    res.status(200).json({
        id : user.id,
        email : user.email,
        created_at : user.created_at
    });
};