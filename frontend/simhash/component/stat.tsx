import React from 'react';

const Stat: React.FC = () => {
    return (
        <div className="container mx-auto">
            <div className="lg:w-1/2 xl:w-2/3">
                <div className="card my-6">
                    <div className="card-header">
                        <h5 className="card-title mb-0">Sales by Country</h5>
                    </div>
                    <div className="card-body">
                        <div className="flex flex-wrap items-center">
                            <div className="w-full sm:w-1/2 lg:w-1/4">
                                <div className="border-primary border rounded text-center py-3 mb-3">
                                    <h5 className="card-title text-primary mb-1">$4000</h5>
                                    <p className="text-primary mb-0">Sales</p>
                                </div>
                                <div className="border-success border rounded text-center py-3 mb-3">
                                    <h5 className="card-title text-success mb-1">$2000</h5>
                                    <p className="text-success mb-0">Revenue</p>
                                </div>
                                <div className="border-warning border rounded text-center py-3">
                                    <h5 className="card-title text-warning mb-1">$200</h5>
                                    <p className="text-warning mb-0">Refund</p>
                                </div>
                            </div>
                            <div className="w-full sm:w-1/2 lg:w-3/4">
                                <div className="flex justify-between">
                                    <p>USA</p>
                                    <p>55%</p>
                                </div>
                                <div className="w-full h-1 bg-gray-200 my-2">
                                    <div className="h-full bg-blue-500" style={{width: '55%'}}></div>
                                </div>
                                <div className="flex justify-between">
                                    <p>UK</p>
                                    <p>20%</p>
                                </div>
                                <div className="w-full h-1 bg-gray-200 my-2">
                                    <div className="h-full bg-green-500" style={{width: '20%'}}></div>
                                </div>
                                <div className="flex justify-between">
                                    <p>Canada</p>
                                    <p>15%</p>
                                </div>
                                <div className="w-full h-1 bg-gray-200 my-2">
                                    <div className="h-full bg-yellow-500" style={{width: '15%'}}></div>
                                </div>
                                <div className="flex justify-between">
                                    <p>Australia</p>
                                    <p>10%</p>
                                </div>
                                <div className="w-full h-1 bg-gray-200 my-2">
                                    <div className="h-full bg-indigo-500" style={{width: '10%'}}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Stat;
