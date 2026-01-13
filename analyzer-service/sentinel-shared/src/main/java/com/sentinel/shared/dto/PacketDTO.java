package com.sentinel.shared.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PacketDTO {

    @JsonProperty("src")
    private String src;

    @JsonProperty("dst")
    private String dst;

    @JsonProperty("proto")
    private int proto;

    @JsonProperty("len")
    private int len;

    @JsonProperty("timestamp")
    private String flags;
}
