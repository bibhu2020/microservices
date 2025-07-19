## Response Patterns

 res.status(200).json({
                status: 'success',
                data: updatedResource
            });

res.status(204).json({
                status: 'success',
                data: null
            });

return res.status(404).json({
                status: 'fail',
                message: 'Purchase order not found'
            });


return res.status(500).json({
            status: 'fail',
            message: response
        })          