<?php

namespace App\Http\Requests\Client\Auth;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\Response;
use Illuminate\Validation\ValidationException;

class RegisterRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            'student_code' => 'required',
            'password' => 'required | min:8|',
            'first_name' => 'required',
            'last_name' => 'required',
            'email' => 'required',
            'image' => 'required',
        ];
    }
    public function messages()
    {
        return [
            'student_code.required' => 'Student code is required',
            'password.required' => 'Password is required',
            'first_name.required' => 'First name is required',
            'last_name.required' => 'Last name is required',
            'email.required' => 'Email is required',
            'image.required' => 'Image is required',
        ];
    }

    public function failedValidation(Validator $validator)
    {
        $errors = (new ValidationException($validator))->errors();
        throw new HttpResponseException(response()->json(
            [
                'error' => $errors,
                'status_code' => 422,
                'messages' => 'Oops... Validate Request',
            ],
            Response::HTTP_UNPROCESSABLE_ENTITY
        ));
    }
}
