import Link from 'next/link';
import React from 'react';

const SignInPage = () => {
    return (
        <div>
            Sign-in
            <Link href="/sign-up">Go to Sign up</Link>
        </div>
    );
};

export default SignInPage;