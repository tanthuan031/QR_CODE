<?php

namespace App\Helpers;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class Helper
{
    /**
     * isCheckFileImage
     *
     * @param  mixed $files
     * @return array
     */
    public static function isCheckFileImage($files, $folder)
    {
        $fileExtension = ['png', 'jpg', 'jpeg', 'gif'];

        if (!is_null($files)) {
            $ext = $files->getClientOriginalExtension();
            if (!in_array($ext, $fileExtension)) {
                return false;
            }
            $size = $files->getSize();
            if ($size > 5000000) {
                return false;
            }
            $nameFile =  static::saveImage($files->getClientOriginalName(), $folder, $files);

            return $nameFile;
        } else {

            return null;
        }
    }


    /**
     * base64Image
     *
     * @param  mixed $param
     * @param  mixed $folder
     * @return filename
     */
    public static function saveImage($files, $folder)
    {
        // $arrayImage = explode(";", $files);
        $storage = Storage::disk('public');
        $newFileName = '';
        foreach ($files as $item) {
            // $path = explode(".", $item);
            // preg_match('/.([0-9]+) /', microtime(), $m);
            // $fileName = sprintf('img%s%s.%s', date('YmdHis'), $m[1], $path[1]);
            $checkDirectory = $storage->exists($folder);

            if (!$checkDirectory) {
                $storage->makeDirectory($folder);
            }
            $storage->putFileAs($folder, $item, 'f');
            // $newFileName .= $fileName . ',';
        }

        return substr($newFileName, 0, -1);
    }


    /**
     * saveImgBase64
     *
     * @param  mixed $param
     * @param  mixed $folder
     * @return filename
     */
    public static function saveImgBase64v1($param, $folder)
    {
        $fileExtension = ['png', 'jpg', 'jpeg', 'gif'];

        if (count(explode(';', $param)) != 2) return false;
        list($extension, $content) = explode(';', $param);
        $tmpExtension = explode('/', $extension);
        if (!in_array($tmpExtension[1], $fileExtension)) {

            return false;
        }
        preg_match('/.([0-9]+) /', microtime(), $m);
        $fileName = sprintf('img%s%s.%s', date('YmdHis'), $m[1], $tmpExtension[1]);
        $content = explode(',', $content)[1];
        $storage = Storage::disk('public');

        $checkDirectory = $storage->exists($folder);

        if (!$checkDirectory) {
            $storage->makeDirectory($folder);
        }
        $storage->put($folder . '/' . $fileName, base64_decode($content), 'public');
        return $fileName;
    }




    /**
     * saveImgBase64
     *
     * @param  mixed $param
     * @param  mixed $folder
     * @return 
     */
    public static function saveImgBase64($param, $folder)
    {
        $newFileName = '';
        if ($param != null) {
            foreach ($param as $file) {
                list($extension, $content) = explode(';', $file);
                // dd($extension, $content);
                $tmpExtension = explode('/', $extension);
                preg_match('/.([0-9]+) /', microtime(), $m);
                $fileName = sprintf('img%s%s.%s', date('YmdHis'), $m[1], $tmpExtension[1]);
                $content = explode(',', $content)[1];
                $storage = Storage::disk('public');

                $checkDirectory = $storage->exists($folder);
                if (!$checkDirectory) {
                    $storage->makeDirectory($folder);
                }
                $storage->put($folder . '/' . $fileName, base64_decode($content), 'public');
                $newFileName .= $fileName . ',';
            }
            return substr($newFileName, 0, -1);
        } else {
            return "";
        }
    }



    /**
     * saveImg
     *
     * @param  mixed $param
     * @param  mixed $folder
     * @return 
     */
    public static function saveImg($param, $folder)
    {

        // dd($param);
        $storage = Storage::disk('public');
        $newFileName = '';
        foreach ($param as $item) {
            $nameOld = $item->getClientOriginalName();
            $path = explode(".", $nameOld);
            preg_match('/.([0-9]+) /', microtime(), $m);
            $fileName = sprintf(
                'img%s%s.%s',
                date('YmdHis'),
                $m[1],
                $path[1]
            );

            $checkDirectory = $storage->exists($folder);

            if (!$checkDirectory) {
                $storage->makeDirectory($folder);
            }
            $storage->putFileAs(
                $folder,
                $item,
                $fileName
            );
            $newFileName .= $fileName . ',';
        }
        // dd($newFileName);
        return substr($newFileName, 0, -1);
    }
}
